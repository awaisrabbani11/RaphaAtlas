import React, { useEffect } from 'react';
import { Article } from '../types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

interface AutoHeadManagerProps {
  activeTab: string;
  selectedArticle?: Article | null;
  selectedPillar?: string;
}

export const AutoHeadManager: React.FC<AutoHeadManagerProps> = ({
  activeTab,
  selectedArticle,
  selectedPillar = 'ALL',
}) => {
  useEffect(() => {
    // 0. Guarantee Google Tag (gtag.js) script is injected automatically if absent
    const TRACKING_ID = 'G-VFCC4DF80F';
    let gtagScript = document.querySelector(`script[src*="${TRACKING_ID}"]`) as HTMLScriptElement | null;
    if (!gtagScript) {
      gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement('script');
      inlineScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${TRACKING_ID}');
      `;
      document.head.appendChild(inlineScript);
    }

    // 1. Ensure Sitemap & LLM discovery tags are dynamically maintained in <head>
    let sitemapLink = document.querySelector('link[rel="sitemap"]') as HTMLLinkElement | null;
    if (!sitemapLink) {
      sitemapLink = document.createElement('link');
      sitemapLink.rel = 'sitemap';
      sitemapLink.type = 'application/xml';
      sitemapLink.title = 'Sitemap';
      sitemapLink.href = '/sitemap.xml';
      document.head.appendChild(sitemapLink);
    }

    let llmLink = document.querySelector('link[rel="alternate"][href="/llms.txt"]') as HTMLLinkElement | null;
    if (!llmLink) {
      llmLink = document.createElement('link');
      llmLink.rel = 'alternate';
      llmLink.type = 'text/plain';
      llmLink.title = 'LLM Documentation';
      llmLink.href = '/llms.txt';
      document.head.appendChild(llmLink);
    }

    // 2. Determine page title, description, and canonical path
    let title = 'RaphaAtlas.com — Map of Healing & Health AI';
    let description = 'The Sovereign Journal & Architecture of Clinical Medicine, Human Performance, and Health AI.';
    let canonicalUrl = 'https://www.raphaatlas.com/';

    if (selectedArticle) {
      title = `${selectedArticle.title} — RaphaAtlas Journal`;
      description = selectedArticle.subtitle || selectedArticle.excerpt;
      canonicalUrl = `https://www.raphaatlas.com/article/${selectedArticle.id}`;
    } else if (activeTab === 'about') {
      title = 'About Us — Project of Growth Partners Global LLC | RaphaAtlas.com';
      description = 'RaphaAtlas is a clinical health calculator hub developed under Growth Partners Global LLC and guided by Dr. Muhammad Awais Rabbani and Dr. Ahmed Humayon.';
      canonicalUrl = 'https://www.raphaatlas.com/about';
    } else if (activeTab === 'contact') {
      title = 'Contact Medical Team — RaphaAtlas.com';
      description = 'Contact the medical and engineering team at RaphaAtlas. Emails: dr.awais@growthpartnersgloballlc.com & dr.ahmed@growthpartnergloballlc.com.';
      canonicalUrl = 'https://www.raphaatlas.com/contact';
    } else if (activeTab === 'ai_tools') {
      title = 'AI Health Engine Sandbox — RaphaAtlas.com';
      description = 'Interactive AI Clinical Triage, Symptom Assessment, and Diagnostic Logic Engines.';
      canonicalUrl = 'https://www.raphaatlas.com/ai-tools';
    } else if (activeTab === 'body_type_calculator') {
      title = 'Body Type Calculator: Shape & Waist-to-Hip Ratio — RaphaAtlas.com';
      description = 'Calculate your female or male body shape classification (Hourglass, Pear, Rectangle, Inverted Triangle, etc.) and waist-to-hip ratio.';
      canonicalUrl = 'https://www.raphaatlas.com/body-type-calculator';
    } else if (activeTab === 'bac_calculator') {
      title = 'Blood Alcohol Concentration (BAC) Calculator — RaphaAtlas.com';
      description = 'Free evidence-based BAC calculator estimating blood alcohol levels, driving limit thresholds, and time to sobriety using the Widmark equation.';
      canonicalUrl = 'https://www.raphaatlas.com/bac-calculator';
    } else if (activeTab === 'macro_calculator') {
      title = 'Free Macro Calculator: Accurate Protein, Fat & Carbs — RaphaAtlas.com';
      description = 'Calculate your personalized daily macronutrients and calories for weight loss, maintenance, or muscle gain.';
      canonicalUrl = 'https://www.raphaatlas.com/macro-calculator';
    } else if (activeTab === 'content') {
      title = 'Content & Category Matrix — RaphaAtlas.com';
      description = 'Complete taxonomy across Lifestyle, Fitness, Medical Science, and AI Engineering.';
      canonicalUrl = 'https://www.raphaatlas.com/content-matrix';
    } else if (activeTab === 'architecture') {
      title = 'System Architecture & Data Flows — RaphaAtlas.com';
      description = 'Full-stack platform technical architecture, security, and integration specifications.';
      canonicalUrl = 'https://www.raphaatlas.com/architecture';
    } else if (activeTab === 'tech') {
      title = 'Tech Stack Integration Matrix — RaphaAtlas.com';
      description = 'Specifications for React, Vite, Tailwind CSS, TypeScript, and AI integrations.';
      canonicalUrl = 'https://www.raphaatlas.com/tech-integration';
    } else if (activeTab === 'ux') {
      title = 'User Journeys & Clinical Workflows — RaphaAtlas.com';
      description = 'Clinical user journeys from acute triage to longitudinal health optimization.';
      canonicalUrl = 'https://www.raphaatlas.com/user-journeys';
    } else if (selectedPillar && selectedPillar !== 'ALL') {
      const formattedPillar = selectedPillar.charAt(0).toUpperCase() + selectedPillar.slice(1).toLowerCase();
      title = `${formattedPillar} & Performance — RaphaAtlas.com`;
      description = `Clinical research and evidence-based protocols in ${formattedPillar}.`;
      canonicalUrl = `https://www.raphaatlas.com/${selectedPillar.toLowerCase()}`;
    }

    // 3. Update document title
    document.title = title;

    // 4. Update Meta Description tag
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 5. Update Canonical link tag
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonicalUrl;

    // 6. Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = title;

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = description;

    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = canonicalUrl;

    // 7. Track Virtual Pageview in Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('config', TRACKING_ID, {
        page_title: title,
        page_location: canonicalUrl,
      });
    }
  }, [activeTab, selectedArticle, selectedPillar]);

  return null; // Silent automated head controller
};
