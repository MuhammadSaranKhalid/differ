"use client";

import { useEffect, useRef } from "react";

interface GoogleAdProps {
    slot: string;
    client?: string;
    format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
    responsive?: string;
    style?: React.CSSProperties;
    className?: string;
    layoutKey?: string;
}

export function GoogleAd({
    slot,
    client = "ca-pub-5918501657114399",
    format = "auto",
    responsive = "true",
    style = { display: "block" },
    className,
    layoutKey,
}: GoogleAdProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isAdLoaded = useRef(false);

    useEffect(() => {
        // Only load the ad once and check if it hasn't been loaded yet
        if (isAdLoaded.current) return;

        // Check if the ad element already has content (ads loaded)
        if (adRef.current && adRef.current.getAttribute('data-adsbygoogle-status')) {
            return;
        }

        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            isAdLoaded.current = true;
        } catch {
            // Silently ignore AdSense errors (common during HMR)
        }
    }, []);

    return (
        <div className={`overflow-hidden ${className || ""}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                data-ad-layout-key={layoutKey}
            />
        </div>
    );
}
