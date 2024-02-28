import React, { SVGProps, useEffect } from "react";

import { CSSRules } from "./styles";

export const GitHubBanner = () => {
  useEffect(() => {
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    CSSRules.forEach((rule) =>
      styleTag.sheet?.insertRule(rule, styleTag.sheet.cssRules.length),
    );
  }, []);

  return (
    <div>
    </div>
  );
};

const Text = () => {
  return (
    <a
      className="gh-link"
      href="https://github.com/refinedev/refine/tree/master/examples/app-crm"
      target="_blank"
      rel="noreferrer"
      style={{
        position: "absolute",
        height: "100%",
        padding: "0 60px",
        display: "flex",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "linear-gradient(90deg, rgba(31, 63, 72, 0.00) 0%, #1F3F48 10%, #1F3F48 90%, rgba(31, 63, 72, 0.00) 100%)",
      }}
    >
      <div
        style={{
          color: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "16px",
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "32px",
          }}
        >
          💡
        </span>
        <span className="text">
          This example is open-source! Get the full source code.
        </span>
      </div>
    </a>
  );
};

const GlowSmall = ({ style, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={80}
      height={40}
      fill="none"
      style={{
        opacity: 1,
        animation: "top-announcement-glow 1s ease-in-out infinite alternate",
        ...style,
      }}
    >
      <circle cx={40} r={40} fill={`url(#${props.id}-a)`} fillOpacity={0.5} />
      <defs>
        <radialGradient
          id={`${props.id}-a`}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 40 -40 0 40 0)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#47EBEB" />
          <stop offset={1} stopColor="#47EBEB" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
};

const GlowBig = ({ style, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={120}
    height={48}
    fill="none"
    {...props}
    style={{
      opacity: 1,
      animation: "top-announcement-glow 1s ease-in-out infinite alternate",
      ...style,
    }}
  >
    <circle
      cx={60}
      cy={24}
      r={60}
      fill={`url(#${props.id}-a)`}
      fillOpacity={0.5}
    />
    <defs>
      <radialGradient
        id={`${props.id}-a`}
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 60 -60 0 60 24)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#47EBEB" />
        <stop offset={1} stopColor="#47EBEB" stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);
