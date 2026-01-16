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
  <footer className="w-full border-t border-gray-200 bg-gray-50 mt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-4 justify-center">
            {navItems?.map((item, index) => (
              <Link
                key={index}
                href={item.url || '#'}
                className="text-sm text-gray-600 hover:text-[#6D4AF9] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex gap-4">
            {socialMedia?.map((social, index) => {
              const Icon = socialIcons[social.platform || '']
              if (!Icon) return null
              return (
                <a
                  key={index}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#6D4AF9] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {copyrightText || 'Copyright © 2025 PollWarehouse. All rights reserved.'}
        </div>
      </div>
    </footer>
  )
}
