"use client";

import Link from "next/link";
import React from "react";
import {  Camera } from "lucide-react";
import type { Poll, Media } from "@/payload-types";
import Image from "next/image";

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const heroImage = poll.heroImage as Media | null;
  const imageUrl = heroImage?.url;
  return (
    <Link
      key={poll.id}
      href={`/poll/${poll.slug}`}
      className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative w-full h-[90px] bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heroImage?.alt || poll.question}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-1">
        <p className="text-gray-600 text-sm line-clamp-2">{poll.question}</p>
      </div>
    </Link>
  );
};
