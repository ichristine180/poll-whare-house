"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import type { Poll, Media, Category } from "@/payload-types";

// Social media icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const XTwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface VotePollProps {
  poll: Poll;
}

// Share Card Component for social sharing
function ShareCard({
  question,
  results,
  heroImageUrl,
  votedOption,
  totalVotes,
  badge,
}: {
  question: string;
  results: Array<{ text: string; votes: number; percentage: number }>;
  heroImageUrl?: string | null;
  votedOption?: string | null;
  totalVotes: number;
  badge?: { title: string; subtext: string } | null;
}) {
  const getColor = (text: string, index: number) => {
    const lowerText = text.toLowerCase();
    if (lowerText === "yes") return "#84cc16"; // lime-500
    if (lowerText === "no") return "#ef4444"; // red-500
    const fallbackColors = [
      "#6366f1",
      "#f97316",
      "#ec4899",
      "#8b5cf6",
      "#14b8a6",
    ];
    return fallbackColors[index % fallbackColors.length];
  };

  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerSize = size - strokeWidth * 2 - 12;

  let cumulativePercent = 0;
  const segments = results.map((option, index) => {
    const percent = option.percentage || 0;
    const dashLength = (percent / 100) * circumference;
    const dashOffset =
      circumference - (cumulativePercent / 100) * circumference;
    cumulativePercent += percent;
    return {
      color: getColor(option.text, index),
      dashArray: `${dashLength} ${circumference - dashLength}`,
      dashOffset: dashOffset,
      percent,
    };
  });

  return (
    <div className="w-full max-w-[600px] px-4 py-5 sm:px-8 sm:py-8 bg-indigo-50 rounded-sm">
      {badge ? (
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-[18px] sm:text-[24px] font-bold text-gray-900 leading-snug">
            {badge.title}
          </h1>
          <p className="text-[14px] sm:text-[16px] text-gray-600 mt-2">
            {badge.subtext}
          </p>
        </div>
      ) : (
        <h1 className="text-[18px] sm:text-[24px] font-bold text-gray-900 text-center mb-5 sm:mb-8 leading-snug">
          {question}
        </h1>
      )}

      <div className="flex flex-col sm:flex-row  justify-center gap-6 sm:gap-12">
        {/* Donut Chart with Total Votes */}
        <div className="flex flex-col items-center">
          <div className="relative flex-shrink-0 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full absolute top-0 left-0"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              {[...segments].reverse().map((segment, index) => (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="butt"
                />
              ))}
            </svg>

            <div
              className="absolute rounded-full bg-white"
              style={{
                top: `${((size - centerSize - 12) / 2 / size) * 100}%`,
                left: `${((size - centerSize - 12) / 2 / size) * 100}%`,
                width: `${((centerSize + 12) / size) * 100}%`,
                height: `${((centerSize + 12) / size) * 100}%`,
              }}
            />

            <div
              className="absolute rounded-full bg-gray-200 overflow-hidden"
              style={{
                top: `${((size - centerSize) / 2 / size) * 100}%`,
                left: `${((size - centerSize) / 2 / size) * 100}%`,
                width: `${(centerSize / size) * 100}%`,
                height: `${(centerSize / size) * 100}%`,
              }}
            >
              {heroImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImageUrl}
                  alt=""
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
           <div className="flex flex-row   gap-6 sm:gap-8 mt-4">
        {results.map((option, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded flex-shrink-0"
              style={{ backgroundColor: getColor(option.text, index) }}
            />
            <span className="text-[15px] sm:text-[18px] font-medium text-gray-800">
              {option.text}
            </span>
            
          </div>
        ))}
      </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 sm:gap-2">
          {/* Total Votes Display */}
          <div className="text-center sm:text-left mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {totalVotes.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-2">Votes</span>
          </div>

         

          {votedOption && (
            <p className="text-[14px] sm:text-[16px] font-medium text-gray-700">
              {results.find(r => r.text === votedOption)?.percentage || 0}% choose the same, what about you?
            </p>
          )}
        </div>
        
      </div>
     
    </div>
  );
}

export function VotePoll({ poll }: VotePollProps) {
  const [currentPoll, setCurrentPoll] = useState<Poll>(poll);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<
    Array<{ text: string; votes: number; percentage: number }>
  >([]);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingNextPoll, setIsLoadingNextPoll] = useState(false);
  const [noMorePolls, setNoMorePolls] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badge, setBadge] = useState<{ title: string; subtext: string } | null>(null);

  const heroImage = currentPoll.heroImage as Media | null;
  const heroImageUrl = heroImage?.url || null;

  // Get tags from poll
  const tags = currentPoll.tags?.map((t) => t.tag).filter(Boolean) || [];

  const checkVoteStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/poll-vote/${currentPoll.id}`);
      const data = await res.json();

      if (data.hasVoted) {
        setHasVoted(true);
        setVotedOptionIndex(data.votedOptionIndex);
        setResults(data.results);
        setTotalVotes(data.totalVotes);
        setShowResults(false);
        setBadge(data.badge || null);
      } else {
        setHasVoted(false);
        setVotedOptionIndex(null);
        setResults([]);
        setTotalVotes(currentPoll.totalVotes || 0);
        setBadge(null);
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPoll.id, currentPoll.totalVotes]);

  useEffect(() => {
    checkVoteStatus();
  }, [checkVoteStatus]);

  // Fetch categories when user has voted
  useEffect(() => {
    if (hasVoted && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await fetch("/api/categories-list");
          const data = await res.json();
          if (data.docs) {
            setCategories(data.docs);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [hasVoted, categories.length]);

  const handleNextPoll = async () => {
    setIsLoadingNextPoll(true);
    setNoMorePolls(false);

    try {
      const res = await fetch(`/api/random-poll?exclude=${currentPoll.id}`);
      const data = await res.json();

      if (res.ok && data.poll) {
        setCurrentPoll(data.poll);
        setHasVoted(false);
        setVotedOptionIndex(null);
        setSelectedOption(null);
        setResults([]);
        setTotalVotes(data.poll.totalVotes || 0);
        setShowResults(false);
        setBadge(null);
        // Update URL without navigation
        window.history.pushState({}, "", `/${data.poll.slug}`);
      } else {
        setNoMorePolls(true);
      }
    } catch (error) {
      console.error("Error fetching next poll:", error);
      setNoMorePolls(true);
    } finally {
      setIsLoadingNextPoll(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null || isVoting) return;

    setIsVoting(true);

    try {
      const res = await fetch(`/api/poll-vote/${currentPoll.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: selectedOption }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasVoted(true);
        setVotedOptionIndex(selectedOption);
        setResults(data.results);
        setTotalVotes(data.totalVotes);
        setShowResults(false);
        setBadge(data.badge || null);
      } else {
        alert(data.error || "Failed to record vote");
      }
    } catch (error) {
      console.error("Vote error:", error);
      alert("Failed to record vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = (platform: string) => {
    const votedText =
      votedOptionIndex !== null ? results[votedOptionIndex]?.text : "";
    const shareText = votedText
      ? `I voted ${votedText}. What about you?`
      : `${currentPoll.question} - Vote now!`;

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const pollPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    const pageUrl = votedText
      ? `${baseUrl}${pollPath}?voted=${encodeURIComponent(votedText)}`
      : typeof window !== "undefined"
        ? window.location.href
        : "";
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedText = encodeURIComponent(shareText);

    const isMobile =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
        break;
      case "whatsapp":
        if (isMobile) {
          window.location.href = `whatsapp://send?text=${encodedText}%20${encodedUrl}`;
        } else {
          window.open(
            `https://web.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
            "_blank"
          );
        }
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`,
          "_blank"
        );
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">Poll</span>
      </nav>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-3">
          <span className="text-gray-500 text-[14px]">Tags: </span>
          {tags.map((tag, index) => (
            <span key={index} className="text-indigo-600 text-[14px]">
              {tag}
              {index < tags.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      {/* Question - show only before voting */}
      {!hasVoted && (
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {currentPoll.question}
        </h1>
      )}

      {/* Hero Image - show only before voting */}
      {!hasVoted && heroImageUrl && (
        <div className="mb-4">
          <div
            style={{
              backgroundImage: `url(${heroImageUrl})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              paddingBottom: "56.25%",
              width: "100%",
              borderRadius: "8px",
            }}
          />

          {currentPoll.imageSource && (
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>{currentPoll.imageSource}</span>
            </div>
          )}
        </div>
      )}

      {/* Vote Count - show only before voting */}
      {!hasVoted && (
        <p className="text-gray-600 text-base mb-4">
          {totalVotes.toLocaleString()} Votes
        </p>
      )}

      {/* Options - show only before voting */}
      {!hasVoted && (
        <div className="space-y-3 mb-4">
          {currentPoll.options?.map((option, index) => {
            const isYes = option.text.toLowerCase() === "yes";
            const isNo = option.text.toLowerCase() === "no";
            const isSelected = selectedOption === index;

            let buttonClasses =
              "w-full p-4 text-left text-lg rounded-lg transition-all ";

            if (isYes) {
              buttonClasses += isSelected
                ? "bg-green-600 text-white"
                : "bg-green-500 text-white hover:bg-green-600";
            } else if (isNo) {
              buttonClasses += isSelected
                ? "bg-red-600 text-white"
                : "bg-red-500 text-white hover:bg-red-600";
            } else {
              buttonClasses += isSelected
                ? "border-2 border-indigo-600 bg-indigo-50"
                : "border-2 border-gray-200 hover:border-gray-300";
            }

            return (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={buttonClasses}
              >
                <span className="font-medium text-lg flex items-center justify-between">
                  {option.text}
                  {isSelected && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Share Card - show after voting */}
      {hasVoted && !showResults && results.length > 0 && (
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden">
            <ShareCard
              question={currentPoll.question}
              results={results}
              heroImageUrl={heroImageUrl}
              votedOption={
                votedOptionIndex !== null
                  ? results[votedOptionIndex]?.text
                  : null
              }
              totalVotes={totalVotes}
              badge={badge}
            />
          </div>

          {/* Share buttons */}
          {!currentPoll.pollSettings?.hideShareOptions && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Share Your Vote
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FacebookIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Facebook
                  </span>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <WhatsAppIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Whatsapp
                  </span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <XTwitterIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Twitter
                  </span>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <LinkedInIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Linkedin
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!hasVoted ? (
        <>
          <button
            onClick={handleVote}
            disabled={selectedOption === null || isVoting}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isVoting ? "Voting..." : "Vote"}
          </button>

          {/* Share Section - Before Voting */}
          {!currentPoll.pollSettings?.hideShareOptions && (
            <div className="mt-9">
              <div className="flex justify-center">
                {noMorePolls ? (
                  <div className="text-center text-gray-600 py-3 mb-6">
                    No more polls available at the moment
                  </div>
                ) : (
                  <button
                    onClick={handleNextPoll}
                    disabled={isLoadingNextPoll}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors mb-6"
                  >
                    {isLoadingNextPoll ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 12h18M3 6h18M3 18h18" />
                      </svg>
                    )}
                    {isLoadingNextPoll ? "Loading..." : "Take Another Poll"}
                  </button>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">
                Tell Your Friends About This Poll
              </h3>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FacebookIcon />
                  <span className="text-[14px] font-medium">
                    ({totalVotes})
                  </span>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <WhatsAppIcon />
                  <span className="text-[14px] font-medium">
                    ({totalVotes})
                  </span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <XTwitterIcon />
                  <span className="text-[14px] font-medium">
                    ({totalVotes})
                  </span>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <LinkedInIcon />
                  <span className="text-[14px] font-medium">
                    ({totalVotes})
                  </span>
                </button>
              </div>

              {/* Create Your Own Poll Section */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  create your own poll
                </h3>
                <Link
                  href="/create"
                  className="block bg-indigo-50 rounded-lg py-4 px-6 text-center hover:bg-indigo-100 transition-colors"
                >
                  <p className="text-gray-800 font-medium">
                    No Registration or signup Required Free
                  </p>
                </Link>
              </div>
            </div>
          )}
        </>
      ) : !showResults ? (
        <>
          {/* Description if exists */}
          {currentPoll.description && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600">&#10024;</span>
                <h3 className="font-semibold text-green-700">
                  About This Poll
                </h3>
              </div>
              <p className="text-gray-700 text-sm">{currentPoll.description}</p>
            </div>
          )}

          {/* Take Another Poll */}
          <div className="flex justify-center mb-6">
            {noMorePolls ? (
              <div className="text-center text-gray-600 py-3">
                No more polls available at the moment
              </div>
            ) : (
              <button
                onClick={handleNextPoll}
                disabled={isLoadingNextPoll}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoadingNextPoll ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
                {isLoadingNextPoll ? "Loading..." : "Take Another Poll"}
              </button>
            )}
          </div>

          {/* Create Your Own Poll Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              create your own poll
            </h3>
            <Link
              href="/create"
              className="block bg-indigo-50 rounded-lg py-4 px-6 text-center hover:bg-indigo-100 transition-colors"
            >
              <p className="text-gray-800 font-medium">
                No Registration or signup Required Free
              </p>
            </Link>
          </div>

          {/* Interest Section */}
          {categories.length > 0 && (
            <section className="mt-8">
              <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h2 className="font-semibold text-indigo-600">INTEREST</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const categoryImage = category.image as Media | null;
                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
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
          )}
        </>
      ) : (
        <>
          {/* Detailed Results View */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentPoll.question}
            </h2>
            <div className="space-y-3">
              {results.map((option, index) => {
                const isVoted = votedOptionIndex === index;
                const isYes = option.text.toLowerCase() === "yes";
                const isNo = option.text.toLowerCase() === "no";

                let barColor = "bg-indigo-500";
                if (isYes) barColor = "bg-green-500";
                if (isNo) barColor = "bg-red-500";

                return (
                  <div key={index} className="relative">
                    <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${option.percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <span className="font-medium text-gray-900">
                          {option.text}
                          {isVoted && " ✓"}
                        </span>
                        <span className="font-bold text-gray-900">
                          {option.percentage}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.votes} votes
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              {totalVotes} total votes
            </p>
          </div>

          {/* Share Section */}
          {!currentPoll.pollSettings?.hideShareOptions && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Share Your Vote
                </h3>
                {!noMorePolls && (
                  <button
                    onClick={handleNextPoll}
                    disabled={isLoadingNextPoll}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoadingNextPoll ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 12h18M3 6h18M3 18h18" />
                      </svg>
                    )}
                    {isLoadingNextPoll ? "Loading..." : "Take Another Poll"}
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FacebookIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Facebook
                  </span>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <WhatsAppIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Whatsapp
                  </span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <XTwitterIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Twitter
                  </span>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <LinkedInIcon />
                  <span className="text-[14px] font-medium hidden sm:inline">
                    Linkedin
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Create Your Own Poll Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              create your own poll
            </h3>
            <Link
              href="/create"
              className="block bg-indigo-50 rounded-lg py-4 px-6 text-center hover:bg-indigo-100 transition-colors"
            >
              <p className="text-gray-800 font-medium">
                No Registration or signup Required Free
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
