"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, HelpCircle, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CreatePollForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    url: string;
    alt: string;
  } | null>(null);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    loginToVote: false,
    addComments: false,
    enableCaptcha: true,
    hideShareOptions: false,
    hidePollResults: false,
    endDate: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("File too large. Maximum size is 1MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadedImage(data.media);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/polls/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: formData.question,
          options: [
            { text: "Yes", votes: 0 },
            { text: "No", votes: 0 },
          ],
          pollSettings: {
            loginToVote: formData.loginToVote,
            addComments: formData.addComments,
            enableCaptcha: formData.enableCaptcha,
            hideShareOptions: formData.hideShareOptions,
            hidePollResults: formData.hidePollResults,
          },
          endDate: formData.endDate || null,
          status: "active",
          heroImage: uploadedImage?.id || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/poll/${data.slug}`);
      } else {
        alert("Failed to create poll. Please try again.");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Poll Title Input */}
      <div className="bg-gray-100 rounded-lg p-1">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Enter Poll Title"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            required
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {/* <button
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#6D4AF9] px-3"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button> */}
        </div>
      </div>

      {/* Image Upload Area */}
      <div className="bg-gray-100 rounded-lg p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />

        {uploadedImage ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={uploadedImage.url}
                alt={uploadedImage.alt}
                fill
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Image uploaded successfully
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <label
              htmlFor="image-upload"
              className={`cursor-pointer ${isUploading ? "pointer-events-none" : ""}`}
            >
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-300 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </label>
            <label
              htmlFor="image-upload"
              className={`flex items-center gap-2 text-sm text-[#6D4AF9] font-medium mb-2 cursor-pointer hover:text-[#5a3dd6] ${isUploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </label>
            <p className="text-sm text-gray-500">
              An image that fits your question has a higher chance of having
              participants
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, GIF, WebP (max 1MB)
            </p>
          </div>
        )}
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
      {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Poll options</h3>
        <div className="grid grid-cols-2 gap-4">
          <OptionToggle
            label="Login to Vote"
            checked={formData.loginToVote}
            onChange={(checked) =>
              setFormData({ ...formData, loginToVote: checked })
            }
          />
          <OptionToggle
            label="Add Comments"
            checked={formData.addComments}
            onChange={(checked) =>
              setFormData({ ...formData, addComments: checked })
            }
          />
          <OptionToggle
            label="Enable Captcha"
            checked={formData.enableCaptcha}
            onChange={(checked) =>
              setFormData({ ...formData, enableCaptcha: checked })
            }
          />
          <OptionToggle
            label="Set End Date"
            checked={!!formData.endDate}
            onChange={(checked) =>
              setFormData({
                ...formData,
                endDate: checked ? new Date().toISOString() : "",
              })
            }
            isPro
          />
          <OptionToggle
            label="Hide Share Options"
            checked={formData.hideShareOptions}
            onChange={(checked) =>
              setFormData({ ...formData, hideShareOptions: checked })
            }
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
            onChange={(checked) =>
              setFormData({ ...formData, hidePollResults: checked })
            }
          />
        </div>
      </div> */}

      {/* Pro Upgrade Banner */}
      {/* <div className="bg-[#6D4AF9]/5 border border-[#6D4AF9]/20 rounded-lg p-6 text-center">
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
      </div> */}

      {/* reCAPTCHA Style Checkbox */}
      <div className="border border-gray-300 rounded bg-[#f9f9f9] shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
                className="w-6 h-6 border-2 border-gray-300 rounded cursor-pointer accent-[#4285f4]"
                id="captcha-checkbox"
              />
            </div>
            <label htmlFor="captcha-checkbox" className="text-sm text-gray-700 cursor-pointer select-none">
              I&apos;m not a robot
            </label>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8" viewBox="0 0 64 64">
              <path fill="#1c3aa9" d="M32 0L0 10.67v21.33C0 49.33 13.67 62.67 32 64c18.33-1.33 32-14.67 32-32V10.67L32 0z"/>
              <path fill="#4285f4" d="M32 6.67L6.67 15.33v16C6.67 46 17.33 57.33 32 58.67c14.67-1.33 25.33-12.67 25.33-27.33v-16L32 6.67z"/>
              <path fill="#fff" d="M32 12l-20 6.67v12.67C12 42.67 20.67 52 32 53.33 43.33 52 52 42.67 52 31.33V18.67L32 12z"/>
              <path fill="#1c3aa9" d="M32 17.33L17.33 22v9.33c0 8 6.67 15.33 14.67 16 8-0.67 14.67-8 14.67-16V22L32 17.33z"/>
            </svg>
            <span className="text-[9px] text-gray-500 mt-0.5">reCAPTCHA</span>
            <span className="text-[8px] text-gray-400">Privacy - Terms</span>
          </div>
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>
          By continuing to browse our site you are accepting our{" "}
          <a href="#" className="text-[#6D4AF9] hover:underline">
            cookie policy
          </a>
          .
        </p>
        <p className="flex items-center justify-center gap-1">
          <span>🔒</span> Poll secured using cookies to prevent duplicate votes
          being cast.
        </p>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#6D4AF9] hover:bg-[#5a3dd6] text-white py-3 rounded-lg font-medium"
        disabled={isLoading || !formData.question || !uploadedImage || !captchaChecked}
      >
        {isLoading ? "Creating..." : "Create My Poll"}
      </Button>

      {/* Create My Poll Button */}
      {/* <Button
        type="submit"
        className="w-full bg-[#6D4AF9] hover:bg-[#5a3dd6] text-white py-4 rounded-lg font-medium text-lg"
        disabled={isLoading || !formData.question || !uploadedImage}
      >
        Create My Poll
      </Button> */}
    </form>
  );
}

function OptionToggle({
  label,
  checked,
  onChange,
  isPro = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isPro?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Switch checked={checked} onCheckedChange={onChange} disabled={isPro} />
        <Label className="text-sm">{label}</Label>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      {isPro && (
        <span className="text-xs text-[#6D4AF9] bg-[#6D4AF9]/10 px-2 py-0.5 rounded">
          Pro
        </span>
      )}
    </div>
  );
}
