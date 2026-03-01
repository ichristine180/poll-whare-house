import { NextRequest, NextResponse } from "next/server";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import crypto from "crypto";
import { sendPollStatsEmail } from "@/utilities/sendEmail";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function createVoterIdentifier(
  ip: string,
  userAgent: string,
  pollId: string,
): string {
  return crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}-${pollId}`)
    .digest("hex");
}

function getBadgeFromAxis(
  pollAxis: any,
  votedOption: string,
  intensity: "soft" | "strong",
): { title: string; subtext: string } | null {
  if (!pollAxis?.badges) return null;

  const isYes = votedOption.toLowerCase() === "yes";
  const isNo = votedOption.toLowerCase() === "no";

  if (isYes && intensity === "soft") {
    return pollAxis.badges.yesSoft;
  } else if (isYes && intensity === "strong") {
    return pollAxis.badges.yesStrong;
  } else if (isNo && intensity === "soft") {
    return pollAxis.badges.noSoft;
  } else if (isNo && intensity === "strong") {
    return pollAxis.badges.noStrong;
  }

  return null;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = await getPayloadHMR({ config: configPromise });

    // Get the poll with pollAxis populated
    const poll = await payload.findByID({
      collection: "polls",
      id,
      depth: 2,
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Create voter identifier from IP and user agent
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const voterIdentifier = createVoterIdentifier(ip, userAgent, id);

    // Check if user has already voted
    const existingVote = await payload.find({
      collection: "poll-votes",
      where: {
        poll: { equals: id },
        voterIdentifier: { equals: voterIdentifier },
      },
      limit: 1,
    });

    const hasVoted = existingVote.docs.length > 0;
    const votedOptionIndex = hasVoted ? existingVote.docs[0].optionIndex : null;
    const intensity = hasVoted
      ? (existingVote.docs[0].intensity as "soft" | "strong" | null)
      : null;

    // Calculate results with percentages
    const totalVotes = poll.totalVotes || 0;
    const results =
      poll.options?.map((option) => ({
        text: option.text,
        votes: option.votes || 0,
        percentage:
          totalVotes > 0
            ? Math.round(((option.votes || 0) / totalVotes) * 100)
            : 0,
      })) || [];

    // Get badge info if user has voted and poll has an axis
    let badge: { title: string; subtext: string } | null = null;
    if (
      hasVoted &&
      votedOptionIndex !== null &&
      intensity &&
      poll.pollAxis &&
      typeof poll.pollAxis === "object"
    ) {
      const votedOption = poll.options?.[votedOptionIndex]?.text || "";
      badge = getBadgeFromAxis(poll.pollAxis, votedOption, intensity);
    }

    return NextResponse.json({
      hasVoted,
      votedOptionIndex,
      results,
      totalVotes,
      badge,
      intensity,
    });
  } catch (error: any) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check vote status" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = await getPayloadHMR({ config: configPromise });
    const body = await request.json();
    const { optionIndex } = body;

    if (typeof optionIndex !== "number") {
      return NextResponse.json(
        { error: "Option index is required" },
        { status: 400 },
      );
    }

    // Get the poll with pollAxis populated
    const poll = await payload.findByID({
      collection: "polls",
      id,
      depth: 2,
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const isActive =
      poll.status === "active" ||
      (poll.status === "scheduled" &&
        poll.publishedAt &&
        new Date(poll.publishedAt) <= new Date());
    if (!isActive) {
      return NextResponse.json(
        { error: "Poll is not active" },
        { status: 400 },
      );
    }

    if (
      !poll.options ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return NextResponse.json(
        { error: "Invalid option index" },
        { status: 400 },
      );
    }

    // Create voter identifier from IP and user agent
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const voterIdentifier = createVoterIdentifier(ip, userAgent, id);

    // Check if user has already voted
    const existingVote = await payload.find({
      collection: "poll-votes",
      where: {
        poll: { equals: id },
        voterIdentifier: { equals: voterIdentifier },
      },
      limit: 1,
    });

    if (existingVote.docs.length > 0) {
      return NextResponse.json(
        { error: "You have already voted on this poll" },
        { status: 400 },
      );
    }

    // Randomly select intensity (soft or strong)
    const intensity: "soft" | "strong" =
      Math.random() < 0.5 ? "soft" : "strong";

    // Record the vote with intensity
    await payload.create({
      collection: "poll-votes",
      data: {
        poll: id,
        optionIndex,
        voterIdentifier,
        userAgent,
        intensity,
      },
    });

    // Update the poll vote counts
    const updatedOptions = poll.options.map((option, index) => ({
      ...option,
      votes:
        index === optionIndex ? (option.votes || 0) + 1 : option.votes || 0,
    }));

    const updatedPoll = await payload.update({
      collection: "polls",
      id,
      data: {
        options: updatedOptions,
        totalVotes: (poll.totalVotes || 0) + 1,
      },
    });

    // Calculate results with percentages
    const newTotalVotes = updatedPoll.totalVotes || 0;
    const results =
      updatedPoll.options?.map((option) => ({
        text: option.text,
        votes: option.votes || 0,
        percentage:
          newTotalVotes > 0
            ? Math.round(((option.votes || 0) / newTotalVotes) * 100)
            : 0,
      })) || [];

    // Send stats email when poll reaches exactly 10 votes
    if (
      newTotalVotes === 10 &&
      (poll as any).creatorEmail &&
      !(poll as any).statsEmailSent
    ) {
      try {
        await sendPollStatsEmail({
          to: (poll as any).creatorEmail,
          question: poll.question,
          slug: poll.slug || "",
          totalVotes: newTotalVotes,
          options: results,
        });
        await payload.update({
          collection: "polls",
          id,
          data: { statsEmailSent: true } as any,
        });
      } catch (emailError) {
        console.error('Failed to send poll stats email:', emailError)
      }
    }

    // Get badge info if poll has an axis
    let badge: { title: string; subtext: string } | null = null;
    if (poll.pollAxis && typeof poll.pollAxis === "object") {
      const votedOption = poll.options[optionIndex].text;
      badge = getBadgeFromAxis(poll.pollAxis, votedOption, intensity);
    }

    return NextResponse.json({
      success: true,
      results,
      totalVotes: newTotalVotes,
      badge,
      intensity,
    });
  } catch (error: any) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: error.message || "Failed to vote" },
      { status: 500 },
    );
  }
}
