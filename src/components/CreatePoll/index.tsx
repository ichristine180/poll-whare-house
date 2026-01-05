'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Sparkles, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function CreatePollForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    imageUrl: '',
    loginToVote: false,
    addComments: false,
    enableCaptcha: true,
    hideShareOptions: false,
    hidePollResults: false,
    endDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/polls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: formData.question,
          options: [
            { text: 'Yes', votes: 0 },
            { text: 'No', votes: 0 },
          ],
          pollSettings: {
            loginToVote: formData.loginToVote,
            addComments: formData.addComments,
            enableCaptcha: formData.enableCaptcha,
            hideShareOptions: formData.hideShareOptions,
            hidePollResults: formData.hidePollResults,
          },
          endDate: formData.endDate || null,
          status: 'active',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/poll/${data.slug}`)
      } else {
        alert('Failed to create poll. Please try again.')
      }
    } catch (error) {
      console.error('Error creating poll:', error)
      alert('Failed to create poll. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Poll Title Input */}
      <div className="bg-gray-100 rounded-lg p-1">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Enter Poll Title"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#6D4AF9] px-3"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      </div>

      {/* Image Upload Area */}
      <div className="bg-gray-100 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#6D4AF9] mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            An image that fits your question has a higher chance of having participants
          </p>
        </div>
      </div>

      {/* Yes/No Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="py-4 px-6 bg-white border-2 border-gray-200 rounded-lg text-center font-medium">
          Yes
        </div>
        <div className="py-4 px-6 bg-white border-2 border-gray-200 rounded-lg text-center font-medium">
          No
        </div>
      </div>

      {/* Poll Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Poll options</h3>
        <div className="grid grid-cols-2 gap-4">
          <OptionToggle
            label="Login to Vote"
            checked={formData.loginToVote}
            onChange={(checked) => setFormData({ ...formData, loginToVote: checked })}
          />
          <OptionToggle
            label="Add Comments"
            checked={formData.addComments}
            onChange={(checked) => setFormData({ ...formData, addComments: checked })}
          />
          <OptionToggle
            label="Enable Captcha"
            checked={formData.enableCaptcha}
            onChange={(checked) => setFormData({ ...formData, enableCaptcha: checked })}
          />
          <OptionToggle
            label="Set End Date"
            checked={!!formData.endDate}
            onChange={(checked) =>
              setFormData({ ...formData, endDate: checked ? new Date().toISOString() : '' })
            }
            isPro
          />
          <OptionToggle
            label="Hide Share Options"
            checked={formData.hideShareOptions}
            onChange={(checked) => setFormData({ ...formData, hideShareOptions: checked })}
            isPro
          />
          <OptionToggle
            label="Save as Draft"
            checked={false}
            onChange={() => {}}
            isPro
          />
          <OptionToggle
            label="Hide Poll Results"
            checked={formData.hidePollResults}
            onChange={(checked) => setFormData({ ...formData, hidePollResults: checked })}
          />
        </div>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="bg-[#6D4AF9]/5 border border-[#6D4AF9]/20 rounded-lg p-6 text-center">
        <h4 className="font-semibold text-[#6D4AF9] mb-2">
          Go Pro and gain access to more advanced features
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Unlock premium features like image uploads, timed voting, and ad-free polling for a better
          experience.
        </p>
        <button
          type="button"
          className="text-[#6D4AF9] border border-[#6D4AF9] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6D4AF9]/10 transition-colors"
        >
          Go Pro - $8/mo
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Don&apos;t worry we will save any information entered above.
        </p>
      </div>

      {/* Captcha Placeholder */}
      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
        <input type="checkbox" className="w-5 h-5" />
        <span className="text-sm">I&apos;m not a robot</span>
        <div className="ml-auto text-xs text-gray-400">reCAPTCHA</div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#6D4AF9] hover:bg-[#5a3dd6] text-white py-3 rounded-lg font-medium"
        disabled={isLoading || !formData.question}
      >
        {isLoading ? 'Creating...' : 'Create your poll'}
      </Button>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>
          By continuing to browse our site you are accepting our{' '}
          <a href="#" className="text-[#6D4AF9] hover:underline">
            cookie policy
          </a>
          .
        </p>
        <p className="flex items-center justify-center gap-1">
          <span>🔒</span> Poll secured using cookies to prevent duplicate votes being cast.
        </p>
      </div>

      {/* Create My Poll Button */}
      <Button
        type="submit"
        className="w-full bg-[#6D4AF9] hover:bg-[#5a3dd6] text-white py-4 rounded-lg font-medium text-lg"
        disabled={isLoading || !formData.question}
      >
        Create My Poll
      </Button>
    </form>
  )
}

function OptionToggle({
  label,
  checked,
  onChange,
  isPro = false,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  isPro?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Switch checked={checked} onCheckedChange={onChange} disabled={isPro} />
        <Label className="text-sm">{label}</Label>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      {isPro && (
        <span className="text-xs text-[#6D4AF9] bg-[#6D4AF9]/10 px-2 py-0.5 rounded">Pro</span>
      )}
    </div>
  )
}
