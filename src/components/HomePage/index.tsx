import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, MessageSquare, Share2 } from "lucide-react";
import { PollCard } from "@/components/PollCard";
import { FAQ } from "@/components/FAQ";
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

      {/* FAQ Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions About AskGeopolitics
          </h2>
        </div>
        <FAQ
          items={[
            {
              question: "What does AskGeopolitics do?",
              answer:
                "AskGeopolitics turns major political moments and viral news stories into simple, unbiased questions and quick polls. We also share short explainers so you can understand what happened — and see how people react.",
            },
            {
              question: "Is AskGeopolitics a political party or campaign tool?",
              answer:
                "No. AskGeopolitics is not a political party, campaign tool, or advocacy site. It's a fun, open platform where people can read stories, ask questions, and vote in polls without being pushed toward any political side.",
            },
            {
              question:
                "Does AskGeopolitics take controversial events and turn them into polls?",
              answer:
                "Yes — in a responsible, fact-based way. We take real controversial moments, break them down into simple facts, and then turn them into neutral questions so readers can vote and discuss freely.",
            },
            {
              question: "Why use questions instead of long political articles?",
              answer:
                "Because questions are quick, simple, engaging, and easy to share. You get the core idea instantly and can jump straight into the poll.",
            },
            {
              question: "Who can participate in the polls?",
              answer:
                "Anyone. Polls are open to people everywhere — different countries, ages, backgrounds, and viewpoints. The goal is to create a global mix of opinions.",
            },
            {
              question: "Are the polls scientific?",
              answer:
                "No. They're informal, public polls meant for insight and discussion — not official statistics.",
            },
            {
              question:
                "What makes AskGeopolitics different from regular political sites?",
              answer:
                "We don't lecture. We don't pick sides. We don't tell you who's right. We simply turn politics into fun, fast, fact-based questions and let you decide what you think.",
            },
            {
              question: "Can users suggest their own questions or topics?",
              answer:
                "Yes! You can send us names, events, or political moments you want turned into polls — and we'll create them in our neutral AskGeopolitics style.",
            },
          ]}
        />
      </div>

    </div>
  );
}
