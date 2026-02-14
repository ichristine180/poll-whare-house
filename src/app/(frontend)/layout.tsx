import type { Metadata } from "next";
import React from "react";
import { cn } from "@/utilities/ui";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Footer } from "@/Footer/Component";
import { Header } from "@/Header/Component";
import { Providers } from "@/providers";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { draftMode } from "next/headers";
import { getServerSideURL } from "@/utilities/getURL";
import "./globals.css";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();
  const siteUrl = getServerSideURL();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Pollwarehouse",
        url: siteUrl,
        description:
          "Free Yes or No poll maker platform for real-life questions about relationships, pets, identity, and personal decisions",
        foundingDate: "2025",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Pollwarehouse",
        description:
          "Free Yes or No poll maker platform for real-life questions about relationships, pets, identity, and personal decisions",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Pollwarehouse Poll Maker",
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        operatingSystem: "Web browser",
        description:
          "Free online Yes or No poll creation and voting platform",
      },
    ],
  };

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="KAxv1TOcbF_XkuBkPxwdF8PA_-X_iAkjQhuQsgPX0pk" />
        <meta name="msvalidate.01" content="5F42A0F74BCBB1FF8A1579C25EBC69B5" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7YLQS05DMH"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7YLQS05DMH');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="zoom-content flex-1">
              <main>
                <div className="container mx-auto max-w-3xl py-4 px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@pollwarehouse",
  },
};
