'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ChevronRight, Loader2, Send } from 'lucide-react'

export function Subscribe() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'subscribe-page',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessageType('success')
        setMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setMessageType('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-[60vh] flex flex-col">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">Subscribe</span>
      </nav>

      {/* Subscribe Form Section */}
      <div className="bg-[#F9FAFB] rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscribe To Updates!</h1>
          <p className="text-gray-600">
            Get the latest polls and trending topics delivered
            <br />
            straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {message && (
            <p
              className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Terms Of Service
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
