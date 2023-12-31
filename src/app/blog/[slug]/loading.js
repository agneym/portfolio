"use client";

import { motion } from "framer-motion";
import React from "react";

export default function BlogPostLoading() {
  return (
    <div className="min-h-svh flex items-center w-full justify-center">
      <motion.div
        className="flex flex-col items-center gap-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          viewBox="0 0 135 140"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 fill-slate-600 dark:fill-slate-300"
        >
          <rect y="10" width="15" height="120" rx="6">
            <animate
              attributeName="height"
              begin="0.5s"
              dur="1s"
              values="120;110;100;90;80;70;60;50;40;140;120"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              begin="0.5s"
              dur="1s"
              values="10;15;20;25;30;35;40;45;50;0;10"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="30" y="10" width="15" height="120" rx="6">
            <animate
              attributeName="height"
              begin="0.25s"
              dur="1s"
              values="120;110;100;90;80;70;60;50;40;140;120"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              begin="0.25s"
              dur="1s"
              values="10;15;20;25;30;35;40;45;50;0;10"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="60" width="15" height="140" rx="6">
            <animate
              attributeName="height"
              begin="0s"
              dur="1s"
              values="120;110;100;90;80;70;60;50;40;140;120"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              begin="0s"
              dur="1s"
              values="10;15;20;25;30;35;40;45;50;0;10"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="90" y="10" width="15" height="120" rx="6">
            <animate
              attributeName="height"
              begin="0.25s"
              dur="1s"
              values="120;110;100;90;80;70;60;50;40;140;120"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              begin="0.25s"
              dur="1s"
              values="10;15;20;25;30;35;40;45;50;0;10"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="120" y="10" width="15" height="120" rx="6">
            <animate
              attributeName="height"
              begin="0.5s"
              dur="1s"
              values="120;110;100;90;80;70;60;50;40;140;120"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              begin="0.5s"
              dur="1s"
              values="10;15;20;25;30;35;40;45;50;0;10"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
        <p className="text-slate-600 dark:text-slate-300 text-center">
          Please wait. <br /> Finding your dose
        </p>
      </motion.div>
    </div>
  );
}
