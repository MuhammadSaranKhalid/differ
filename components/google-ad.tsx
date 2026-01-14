"use client";

import { useEffect } from "react";

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
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`overflow-hidden ${className || ""}`}>
            <ins
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
