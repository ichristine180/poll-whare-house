'use client'

import Link from 'next/link'
import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import type { Footer as FooterType } from '@/payload-types'

interface FooterClientProps {
  data: FooterType
}

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

export const FooterClient: React.FC<FooterClientProps> = ({ data }) => {
  const { navItems, socialMedia, copyrightText } = data

  return (
    <footer className="w-full mt-10">
      <div className="mx-auto max-w-[600px] border-t-2 border-[#d1d7e3] px-4 py-5">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navItems?.map((item, index) => (
            <Link
              key={index}
              href={item.url || '#'}
              className="text-[15px] text-[#1e2a54] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Social Media */}
        {socialMedia && socialMedia.length > 0 && (
          <div className="flex justify-center gap-4 mt-4">
            {socialMedia.map((social, index) => {
              const Icon = socialIcons[social.platform || '']
              if (!Icon) return null
              return (
                <a
                  key={index}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1e2a54] hover:opacity-70 transition-opacity"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        )}

        {/* Copyright */}
        <div className="mt-4 text-center text-sm text-[#1e2a54]">
          {copyrightText || '© Copyright 2025 - PollWarehouse. All Rights Reserved.'}
        </div>
      </div>
    </footer>
  )
}
