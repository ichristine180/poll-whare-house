import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Share2 } from "lucide-react";
import { PollCard } from "@/components/PollCard";
import type { Poll, Category, Media } from "@/payload-types";
import { publishedPollFilter } from "@/utilities/pollFilters";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getPolls() {
  const payload = await getPayloadHMR({ config: configPromise });

  const [recentPolls, categories] = await Promise.all([
    payload.find({
      collection: "polls",
      where: {
        and: [
          publishedPollFilter(),
          { or: [{ source: { equals: "admin" } }, { source: { exists: false } }] },
        ],
      },
      sort: "-createdAt",
      limit: 8,
      depth: 2,
    }),
    payload.find({
      collection: "categories",
      where: {
        or: [
          { isActive: { equals: true } },
          { isActive: { exists: false } },
        ],
      },
      limit: 100,
      depth: 1,
    }),
  ]);

  // For each category, fetch top polls by votes
  const categoryPolls = await Promise.all(
    categories.docs.map(async (category) => {
      const topPolls = await payload.find({
        collection: "polls",
        where: {
          and: [
            publishedPollFilter(),
            { category: { equals: category.id } },
          ],
        },
        sort: "-totalVotes",
        limit: 10,
        depth: 1,
      });

      return {
        category,
        polls: shuffleArray(topPolls.docs) as Poll[],
        pollCount: topPolls.totalDocs,
      };
    })
  );

  // Build popular polls: shuffle the per-category picks, flatten, cap at 8
  const popularPolls = shuffleArray(categoryPolls.flatMap((c) => c.polls)).slice(0, 8);

  // Sort categories by poll count (most polls first)
  const categoriesWithCounts = categoryPolls
    .map(({ category, pollCount }) => ({ ...category, pollCount }))
    .sort((a, b) => b.pollCount - a.pollCount);

  return {
    popularPolls,
    recentPolls: recentPolls.docs as Poll[],
    categories: categoriesWithCounts as Category[],
  };
}

export async function HomePage() {
  const { popularPolls, recentPolls, categories } = await getPolls();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Create a Yes/No Poll in Seconds
        </h1>
        <p className="text-gray-600">
          A fast, fun way to ask and answer Yes/No questions. No accounts, No
          friction.
        </p>
        <Link
          href="/create"
          className="inline-block mt-4 bg-[#6D4AF9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a3dd6] transition-colors"
        >
          Create Your Poll
        </Link>
      </div>

      {/* Most Popular Polls */}
      <section>
        <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-4">
          <span className="text-lg">🔥</span>

          <div>
            <h2 className="font-semibold text-indigo-600">Popular Right Now</h2>
          </div>
        </div>

        {popularPolls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No popular polls at the moment.</p>
        )}
      </section>

      {/* Interest Section - Polls about Culture */}
      <section>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-4 hover:opacity-80 transition-opacity"
        >
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h2 className="font-semibold text-indigo-600">INTEREST</h2>
        </Link>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryImage = category.image as Media | null;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                >
                  {categoryImage?.url ? (
                    <Image
                      src={categoryImage.url}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg px-4 py-2">
                      {category.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
      </section>

      {/* Current & Shared Polls */}
      <section>
        <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-4">
          <Share2 className="w-4 h-4 text-indigo-600" />
          <h2 className="font-semibold text-indigo-600">CURRENT & SHARED POLLS</h2>
        </div>

        {recentPolls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </section>

      {/* Content Section */}
      <div className="mt-12 space-y-8 text-gray-700">

        {/* What Is Pollwarehouse */}
        <section id="what-is-pollwarehouse">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Free Yes or No Poll Maker
          </h2>
          <p className="text-base leading-relaxed mb-3">
            <strong>Pollwarehouse</strong> is an online Yes or No polling platform built for real human questions, not dry surveys.
          </p>
          <p className="text-base leading-relaxed mb-3">
            From relationships and pets to values, ethics, lifestyle, and personal decisions, Pollwarehouse turns messy, private thoughts into simple Yes/No polls people can respond to in seconds.
          </p>
          <p className="text-base leading-relaxed">
            Vote on existing polls, create your own, and see live results without accounts, logins, or friction.
          </p>
        </section>

        {/* Why Use Pollwarehouse */}
        <section id="why-use-pollwarehouse">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Why People Use Pollwarehouse
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Feel less alone in your experience
          </h3>
          <p className="text-base leading-relaxed mb-4">
            See how many people quietly share the same guilt, doubts, and relief you do when you vote on a poll.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Turn your truth into a poll
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Turn the question stuck in your head into a one-click Yes/No poll that anyone can answer and share.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get real-time insight
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Watch live vote percentages update as more people answer, so you can compare your reality with thousands of others.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Share anywhere
          </h3>
          <p className="text-base leading-relaxed">
            Every poll has a unique link you can post on social media, send to friends, or share in communities.
          </p>
        </section>

        {/* How It Works */}
        <section id="how-it-works">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            How Pollwarehouse Works
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            1. Explore Yes/No polls
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Browse polls about love, breakups, family tension, pet guilt, identity, career, and more. Each poll is a clear Yes/No statement you can react to instantly.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2. Vote with one tap
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Choose Yes or No based on how you truly feel. No sign-up, no forms, no profile creation.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            3. See live voting statistics
          </h3>
          <p className="text-base leading-relaxed mb-4">
            As soon as you vote, you see real-time results: total votes, percentages, and how other people answered.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            4. Create your own poll
          </h3>
          <p className="text-base leading-relaxed">
            Have a question no one around you gets? Write a Yes/No statement, publish it in seconds, and watch votes and shares roll in.
          </p>
        </section>

        {/* Poll Maker Tool */}
        <section id="poll-maker-tool">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Free Yes or No Poll Maker
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse includes a simple, free poll-creation tool anyone can use:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Write your Yes or No question</li>
            <li>Publish instantly—no registration needed</li>
            <li>Share the link across social networks and messaging apps</li>
            <li>Track live results from any device</li>
          </ul>
        </section>

        {/* Key Features */}
        <section id="features">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Key Features
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Yes/No format only
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Every poll uses a binary Yes or No answer, making decisions clear, fast, and easy to compare.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Live poll results and statistics
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Results update instantly, so each visitor sees current vote totals and percentages in real time.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No account, no software, no friction
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Pollwarehouse runs entirely in the browser. There&apos;s no app to install and no registration required.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Mobile-first, works on any device
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Polls load quickly and work on desktop, laptop, tablet, and smartphone across all major browsers.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Anonymous participation
          </h3>
          <p className="text-base leading-relaxed mb-4">
            People can vote honestly because results are aggregated and individual voters are never shown.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shareable polls
          </h3>
          <p className="text-base leading-relaxed">
            Every poll comes with a unique URL and social-sharing options.
          </p>
        </section>

        {/* Free and Safe */}
        <section id="free-and-safe">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Is Pollwarehouse Free and Safe?
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Yes. Pollwarehouse is completely free to use and does not require sign-up or personal data.
          </p>
          <p className="text-base leading-relaxed mb-3">
            Because participation is anonymous:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Users can answer honestly without fear of judgment</li>
            <li>Data exposure and privacy risks are minimized</li>
            <li>Anyone can create or vote on polls in seconds from any device</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section id="faq" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              What is Pollwarehouse?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                Pollwarehouse is a free online Yes or No poll maker and voting platform focused on real-life questions about relationships, pets, identity, lifestyle, and personal decisions.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              Do I need an account to vote or create polls?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                No. You can create and vote on polls without creating an account or sharing personal information.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              Is Pollwarehouse really free to use?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                Yes. There are no subscription fees, paywalls, or hidden costs.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              Can I create my own Yes or No poll?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                Yes. Anyone can write a Yes/No question, publish it instantly, and share the poll link to gather votes and see live results.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              Can I share Pollwarehouse polls on social media?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                Yes. Each poll has a shareable link you can post on platforms like Facebook, Twitter, WhatsApp, or in private groups and chats.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              Is my vote anonymous?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed mb-4" itemProp="text">
                Yes. Pollwarehouse only shows aggregated vote counts and percentages. Individual votes are never exposed.
              </p>
            </div>
          </div>

          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
              What kind of polls are on Pollwarehouse?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-base leading-relaxed" itemProp="text">
                Polls about how people really feel—guilt, doubt, loyalty, love, loss, and life choices. Questions you might not ask out loud but want to know if others feel the same way.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section id="cta-closing" className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ready to see how many people feel exactly like you do?
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/categories" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Browse Live Polls
            </Link>
            <Link href="/create" className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Create Your Own Poll
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
}
