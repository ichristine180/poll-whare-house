import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Share2 } from "lucide-react";
import { PollCard } from "@/components/PollCard";
import type { Poll, Category, Media } from "@/payload-types";

async function getPolls() {
  const payload = await getPayloadHMR({ config: configPromise });

  const [popularPolls, recentPolls, categories] = await Promise.all([
    payload.find({
      collection: "polls",
      where: {
        status: { equals: "active" },
        popular: { equals: true },
        or: [{ source: { equals: "admin" } }, { source: { exists: false } }],
      },
      sort: "-createdAt",
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
          href="/interest"
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
        {/* Intro */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pollwarehouse – Online Yes or No Poll Maker
          </h2>
          <p className="text-base leading-relaxed">
            <strong>Pollwarehouse</strong> is an online Yes or No polling platform that lets users create polls, vote on real questions, and view live voting statistics. The platform covers topics across life, values, identity, ethics, lifestyle, and personal decisions. Pollwarehouse is <strong>free to use</strong>, requires no software installation, and no sign-up. It makes creating polls fast, simple, and accessible from any device, while allowing users to see real-time vote results and share opinions across social networks.
          </p>
        </div>

        {/* What Is Pollwarehouse */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            What Is Pollwarehouse?
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse is a web-based poll maker tool designed for creating and participating in Yes or No polls. It allows users to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create a poll instantly</li>
            <li>Vote on existing questions</li>
            <li>View live poll results and statistics</li>
            <li>Share opinions through comments and social platforms</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            You don&apos;t need to install any software or create an account to use Pollwarehouse. Everything works directly in your web browser.
          </p>
        </div>

        {/* Advantages */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Advantages of Using Pollwarehouse for Creating Polls
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Using Pollwarehouse comes with several benefits:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Free to use</strong> – No registration or payment required</li>
            <li><strong>Simple poll creation</strong> – Create Yes or No polls in seconds</li>
            <li><strong>Live voting results</strong> – See statistics update in real time</li>
            <li><strong>User-friendly interface</strong> – Easy to use for all audiences</li>
            <li><strong>Unlimited participation</strong> – Vote and explore as many polls as you like</li>
            <li><strong>Social sharing</strong> – Share polls and results across social networks</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Pollwarehouse is designed to remove friction from polling while keeping results transparent and accessible.
          </p>
        </div>

        {/* How to Use */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            How to Use Pollwarehouse to Create or Vote on a Poll
          </h2>
          <p className="text-base leading-relaxed mb-4">
            Creating or participating in a poll on Pollwarehouse is quick and straightforward.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Simple Steps to Create a Poll
          </h3>
          <ol className="list-decimal list-inside space-y-1 ml-2 mb-4">
            <li>Visit the Pollwarehouse website</li>
            <li>Write your Yes or No question</li>
            <li>Publish the poll instantly</li>
            <li>Share the poll and track live results</li>
          </ol>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Simple Steps to Vote on a Poll
          </h3>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Open any poll page</li>
            <li>Choose Yes or No</li>
            <li>View live vote statistics</li>
            <li>Read or share opinions in the comments</li>
          </ol>
          <p className="text-base leading-relaxed mt-3">
            No account is required at any step.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Features of the Pollwarehouse Online Poll Maker
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User-Friendly Interface
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Pollwarehouse is built with simplicity in mind. The clean interface allows users to create, vote, and explore polls without confusion or learning curves.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Software Installation Required
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Pollwarehouse runs entirely in your browser. There&apos;s no need to download apps, plugins, or extensions.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Yes or No Poll Format
          </h3>
          <p className="text-base leading-relaxed mb-4">
            All polls use a binary Yes or No format, making decisions clear, fast, and comparable across users.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Live Poll Results and Statistics
          </h3>
          <p className="text-base leading-relaxed">
            Vote results update instantly, allowing users to see how opinions change over time.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Categories and Topics Available on Pollwarehouse
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse hosts polls across multiple categories, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Life decisions</li>
            <li>Personal values</li>
            <li>Identity and beliefs</li>
            <li>Ethics and morality</li>
            <li>Lifestyle and relationships</li>
            <li>Social and cultural topics</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Users can explore polls based on their interests, vote, and share them with friends, family, or online communities.
          </p>
        </div>

        {/* Compatibility */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Pollwarehouse Compatibility Across Devices
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse works on:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Desktop computers</li>
            <li>Laptops</li>
            <li>Tablets</li>
            <li>Smartphones</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            It is compatible with all modern web browsers, including Chrome, Firefox, Safari, and Edge, and works on Windows, macOS, Android, and iOS devices.
          </p>
        </div>

        {/* Free and Safe */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Is Pollwarehouse Free and Safe to Use?
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Yes. Pollwarehouse is completely free and does not require sign-up or personal information. Because no registration is required:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>User data exposure is minimized</li>
            <li>Participation is fast and anonymous</li>
            <li>Privacy risks are reduced</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Pollwarehouse focuses on open participation while keeping the experience simple and secure.
          </p>
        </div>

        {/* Speed and Performance */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Speed and Performance of Pollwarehouse
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse is optimized for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Fast poll creation</li>
            <li>Instant voting</li>
            <li>Real-time result updates</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Pages load quickly, and poll results update without delays, even as participation grows.
          </p>
        </div>

        {/* Why Use */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Why Use Pollwarehouse?
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Pollwarehouse helps users:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Express opinions clearly</li>
            <li>Compare their views with others</li>
            <li>Explore real questions people care about</li>
            <li>Participate without friction or commitment</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            It turns simple Yes or No questions into shared public insight.
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions (FAQ)
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What is Pollwarehouse?
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Pollwarehouse is an online Yes or No poll maker that allows users to create polls, vote, and view live results without signing up.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Is Pollwarehouse free to use?
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Yes. Pollwarehouse is completely free and does not require registration.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Do I need to install any software?
          </h3>
          <p className="text-base leading-relaxed mb-4">
            No. Pollwarehouse works directly in your web browser.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Can I vote on polls without creating an account?
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Yes. Voting is open and does not require sign-up.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What type of polls can I create?
          </h3>
          <p className="text-base leading-relaxed mb-4">
            Pollwarehouse supports Yes or No questions across many topics, including life, ethics, values, lifestyle, and personal decisions.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Can I share my polls?
          </h3>
          <p className="text-base leading-relaxed">
            Yes. Polls can be shared across social networks and messaging platforms.
          </p>
        </div>
      </div>

    </div>
  );
}
