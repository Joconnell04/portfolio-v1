"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GitHubActivityHeatmap } from "@/components/github-heatmap";
import { MagneticButton } from "@/components/magnetic";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ProjectsSection } from "@/components/projects-section";
import { ScrollProgress } from "@/components/scroll-progress";
import { TextScramble } from "@/components/text-scramble";
import { fadeUpContainer, fadeUpItem, viewportOnce } from "@/components/reveal";
import { cn } from "@/lib/utils";
import type { ContributionHeatmap } from "@/lib/github/contributions";
import type { PortfolioProject } from "@/lib/supabase/portfolio-projects";

type RecruiterProfile = {
  name: string;
  company: string;
};

type RenderPart = { type: "text"; text: string } | { type: string; [key: string]: unknown };
type ChatMessage = UIMessage & {
  content?: string;
  parts?: RenderPart[];
};

const STORAGE_KEY = "recruiter-access-profile";
const NAV_ITEMS = ["Overview", "Projects", "Experience", "Travel", "Contact"] as const;
const BOOT_LINES = ["booting shell", "assembling neon frame", "loading chat tunnel", "aligning project windows"] as const;

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jackson-t-oconnell/", ariaLabel: "Jackson O'Connell on LinkedIn" },
  { label: "GitHub", href: "https://github.com/Joconnell04", ariaLabel: "Jackson O'Connell on GitHub" },
  { label: "All3DP", href: "https://all3dp.com/authors/jacksonoconnell/", ariaLabel: "Jackson O'Connell author page on All3DP" },
] as const;

function extractMessageText(message: ChatMessage) {
  if (typeof message.content === "string" && message.content.trim()) {
    return message.content;
  }

  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part): part is Extract<RenderPart, { type: "text" }> => part.type === "text")
      .map((part) => part.text)
      .join(" ")
      .trim();
  }

  return "";
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const text = extractMessageText(message) || "…";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] whitespace-pre-wrap border px-4 py-3 text-sm leading-6 shadow-lg",
          isUser
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-50"
            : "border-white/10 bg-white/5 text-white/80"
        )}
      >
        <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-white/35">
          {isUser ? "Recruiter" : "Jackson AI"}
        </div>
        {text}
      </div>
    </div>
  );
}

function AccessGate({
  onSubmit,
  disabled,
  value,
  onChange,
}: {
  onSubmit: (profile: RecruiterProfile) => void;
  disabled: boolean;
  value: RecruiterProfile;
  onChange: (next: RecruiterProfile) => void;
}) {
  return (
    <form
      className="hud-window bg-black/95 p-4 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="mb-3">
        <TextScramble className="text-xs uppercase tracking-[0.3em] text-emerald-300/70" text="Recruiter access" />
        <h2 className="mt-2 text-lg font-medium text-white">Identify yourself to continue</h2>
        <p className="mt-1 text-sm text-white/55">
          Enter your name and company so the assistant can tailor the conversation for recruiting context.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/70">
          Name
          <input
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            className="border border-white/10 bg-black/85 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="Jordan Lee"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Company
          <input
            value={value.company}
            onChange={(event) => onChange({ ...value, company: event.target.value })}
            className="border border-white/10 bg-black/85 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="Vertex Talent"
          />
        </label>
      </div>
                    </div>
                  ) : (
                    <AccessGate
                      disabled={!draftProfile.name.trim() || !draftProfile.company.trim()}
                      value={draftProfile}
                      onChange={setDraftProfile}
                      onSubmit={submitProfile}
                    />
                  )}
                </div>

                <div className="hud-window flex min-h-[420px] max-h-[calc(100dvh-10rem)] flex-col bg-black/88">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/35">
                    <TextScramble text="chat session" />
                    <span>{status}</span>
                  </div>

                  <div ref={scrollRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [WebkitOverflowScrolling:touch]">
                    {messages.length === 0 ? (
                      <div className="hud-window border-dashed border-white/10 bg-black/85 p-6 text-sm leading-6 text-[#9fffb7]">
                        Start with a recruiting question. Example: “Give me a 30-second pitch for Jackson for a product
                        role.”
                      </div>
                    ) : (
                      messages.map((message) => <MessageBubble key={message.id} message={message as ChatMessage} />)
                    )}
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!profile || !messageInput.trim() || isBusy) {
                        return;
                      }
                      void sendMessage({ text: messageInput.trim() });
                      setMessageInput("");
                    }}
                    className="border-t border-white/10 p-4"
                  >
                    <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/35">
                      Ask the recruiter agent
                    </label>
                    <textarea
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
                      disabled={!profile || isBusy}
                      rows={3}
                      className="w-full resize-none border border-white/10 bg-black/85 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder={profile ? "e.g. What makes Jackson strong for this role?" : "Complete the gate to chat"}
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-white/40">
                        Powered by /api/chat and the portfolio_embeddings retrieval path.
                      </p>
                      <MagneticButton
                        type="submit"
                        disabled={!profile || !messageInput.trim() || isBusy}
                        className="hud-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#ebfff1] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isBusy ? "Streaming…" : "Send"}
                      </MagneticButton>
                    </div>
                    {error ? <p className="mt-3 text-sm text-rose-300">{error.message}</p> : null}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
