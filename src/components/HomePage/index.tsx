import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, MessageSquare } from "lucide-react";
import { PollCard } from "@/components/PollCard";
import type { Poll, Category, Media } from "@/payload-types";

async function getPolls() {
  const payload = await getPayloadHMR({ config: configPromise });

  const [popularPolls, recentPolls, categories] = await Promise.all([
    payload.find({
      collection: "polls",
      where: {
        status: { equals: "active" },
        or: [{ source: { equals: "admin" } }, { source: { exists: false } }],
      },
      sort: "-totalVotes",
      limit: 8,
    }),
    payload.find({
      collection: "polls",
      where: {
        status: { equals: "active" },
        or: [{ source: { equals: "admin" } }, { source: { exists: false } }],
      },
      sort: "-createdAt",
      limit: 8,
      depth: 2,
    }),
    payload.find({
      collection: "categories",
      limit: 12,
      depth: 1,
    }),
  ]);

  return {
    popularPolls: popularPolls.docs as Poll[],
    recentPolls: recentPolls.docs as Poll[],
    categories: categories.docs as Category[],
  };
}

export async function HomePage() {
  const { popularPolls, recentPolls, categories } = await getPolls();

  // Get the "Culture" category for the Interest section
  const cultureCategory = categories.find(
    (cat) => cat.title.toLowerCase() === "culture" || cat.slug === "culture"
  );
  const culturePolls = recentPolls.filter((poll) => {
    const pollCategory = poll.category as Category | null;
    return pollCategory?.id === cultureCategory?.id;
  });

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

        {popularPolls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </section>

      {/* Interest Section - Polls about Culture */}
      <section>
        <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-4">
          <TrendingUp className="w-4 h-4 text-root" />
          <h2 className="font-semibold text-indigo-600">INTEREST</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryImage = category.image as Media | null;
              return (
                <Link
                  key={category.id}
                  href={`/interest/${category.slug}`}
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

      {/* FAQ Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions About AskGeopolitics
          </h2>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-l-4 border-indigo-600 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              What does AskGeopolitics do?
            </h3>
            <p className="text-gray-600 text-[14px]">
              AskGeopolitics turns major political moments and viral news
              stories into simple, unbiased questions and quick polls. We also
              share short explainers so you can understand what happened — and
              see how people react.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Is AskGeopolitics a political party or campaign tool?
            </h3>
            <p className="text-gray-600 text-[14px]">
              No. AskGeopolitics is not a political party, campaign tool, or
              advocacy site. It&apos;s a fun, open platform where people can
              read stories, ask questions, and vote in polls without being
              pushed toward any political side.
            </p>
          </div>

          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Does AskGeopolitics take controversial events and turn them into
              polls?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Yes — in a responsible, fact-based way. We take real controversial
              moments, break them down into simple facts, and then turn them
              into neutral questions so readers can vote and discuss freely.
            </p>
          </div>

          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Why use questions instead of long political articles?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Because questions are quick, simple, engaging, and easy to share.
              You get the core idea instantly and can jump straight into the
              poll.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Who can participate in the polls?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Anyone. Polls are open to people everywhere — different countries,
              ages, backgrounds, and viewpoints. The goal is to create a global
              mix of opinions.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Are the polls scientific?
            </h3>
            <p className="text-gray-600 text-[14px]">
              No. They&apos;re informal, public polls meant for insight and
              discussion — not official statistics.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              What makes AskGeopolitics different from regular political sites?
            </h3>
            <p className="text-gray-600 text-[14px]">
              We don&apos;t lecture. We don&apos;t pick sides. We don&apos;t
              tell you who&apos;s right. We simply turn politics into fun, fast,
              fact-based questions and let you decide what you think.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Can users suggest their own questions or topics?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Yes! You can send us names, events, or political moments you want
              turned into polls — and we&apos;ll create them in our neutral
              AskGeopolitics style.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
