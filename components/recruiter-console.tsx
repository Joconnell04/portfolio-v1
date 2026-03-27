"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TextScramble } from "@/components/text-scramble";
import { ProjectsSection } from "@/components/projects-section";
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
const NAV_ITEMS = ["Overview", "Projects", "Experience", "Contact"] as const;

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
          "max-w-[88%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-6 shadow-lg",
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
      className="rounded-3xl border border-emerald-400/20 bg-black/55 p-4 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="mb-3">
        <TextScramble className="text-xs uppercase tracking-[0.3em] text-emerald-300/70" text="Recruiter access gate" />
        <h2 className="mt-2 text-lg font-medium text-white">Identify yourself to open the terminal</h2>
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
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="Jordan Lee"
          />
        </label>
        <label className="grid gap-2 text-sm text-white/70">
          Company
          <input
            value={value.company}
            onChange={(event) => onChange({ ...value, company: event.target.value })}
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="Vertex Talent"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Enter terminal
        <span aria-hidden>↵</span>
      </button>
    </form>
  );
}

export function RecruiterConsole({ projects }: { projects: PortfolioProject[] }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<RecruiterProfile>({ name: "", company: "" });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, status, error, setInput } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as RecruiterProfile;
      if (parsed?.name && parsed?.company) {
        setProfile(parsed);
        setDraftProfile(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, drawerOpen]);

  const openText = useMemo(() => {
    if (profile) return `${profile.name} @ ${profile.company}`;
    return "access required";
  }, [profile]);

  const readyToSend = Boolean(profile?.name.trim() && profile?.company.trim());
  const isBusy = status === "submitted" || status === "streaming";

  function submitProfile(nextProfile: RecruiterProfile) {
    const trimmed = {
      name: nextProfile.name.trim(),
      company: nextProfile.company.trim(),
    };

    if (!trimmed.name || !trimmed.company) return;

    setProfile(trimmed);
    setDraftProfile(trimmed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setDrawerOpen(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_42%),linear-gradient(180deg,#030712_0%,#020617_50%,#010208_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-36 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/45">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200/80">
              recruiter console
            </span>
            <span>Jackson O’Connell</span>
            <span>experience graph</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/30">
            {NAV_ITEMS.map((item) => (
              <TextScramble key={item} text={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1" />
            ))}
          </div>
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              <TextScramble text="A terminal-style recruiter interface" />
              <span className="block text-white/70">for fast, evidence-backed selling.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
              The drawer below lets recruiters identify themselves, ask questions, and get concise answers pulled from
              Jackson’s experience graph through the /api/chat stream.
            </p>
          </div>
        </header>

        <ProjectsSection projects={projects} />
      </div>

      <motion.aside
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: drawerOpen ? 0 : 92, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-7xl px-0 sm:px-4 sm:pb-4"
      >
        <div className="overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#020617]/95 shadow-[0_-24px_80px_rgba(0,0,0,0.55)] backdrop-blur xl:rounded-[2rem]">
          <button
            type="button"
            onClick={() => setDrawerOpen((value) => !value)}
            className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5"
          >
            <span className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              <TextScramble className="font-medium text-white" text="Terminal drawer" />
              <span className="text-white/35">{openText}</span>
            </span>
            <TextScramble
              className="text-xs uppercase tracking-[0.25em] text-white/40"
              text={drawerOpen ? "collapse" : "expand"}
            />
          </button>

          <AnimatePresence initial={false} mode="wait">
            {drawerOpen && (
              <motion.div
                key="drawer-body"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)]"
              >
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <TextScramble
                          className="text-xs uppercase tracking-[0.28em] text-emerald-300/70"
                          text="Recruiter mode"
                        />
                        <h2 className="mt-2 text-xl font-semibold text-white">Sell Jackson with evidence</h2>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/55">
                        {readyToSend ? "authenticated" : "gated"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      Ask for a pitch, role fit, resume bullets, or interview prep. The backend pulls relevant fragments
                      from the portfolio embeddings table and streams the answer back to this drawer.
                    </p>
                  </div>

                  {profile ? (
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                      <div className="text-xs uppercase tracking-[0.28em] text-emerald-200/70">Access granted</div>
                      <div className="mt-2 font-medium">
                        {profile.name} at {profile.company}
                      </div>
                      <div className="mt-1 text-emerald-50/70">This session is personalized for recruiting context.</div>
                      <button
                        type="button"
                        onClick={() => {
                          window.localStorage.removeItem(STORAGE_KEY);
                          setProfile(null);
                          setInput("");
                        }}
                        className="mt-4 rounded-full border border-emerald-300/20 px-3 py-1.5 text-xs text-emerald-50/80 transition hover:bg-emerald-300/10"
                      >
                        Reset gate
                      </button>
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

                <div className="flex min-h-[560px] flex-col rounded-3xl border border-white/10 bg-black/40">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/35">
                    <TextScramble text="chat session" />
                    <span>{status}</span>
                  </div>

                  <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                    {messages.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-6 text-white/50">
                        Start with a recruiting question. Example: “Give me a 30-second pitch for Jackson for a product
                        role.”
                      </div>
                    ) : (
                      messages.map((message) => <MessageBubble key={message.id} message={message as ChatMessage} />)
                    )}
                  </div>

                  <form
                    onSubmit={(event) => {
                      if (!profile) {
                        event.preventDefault();
                        return;
                      }
                      handleSubmit(event);
                    }}
                    className="border-t border-white/10 p-4"
                  >
                    <label className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/35">
                      Ask the recruiter agent
                    </label>
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      disabled={!profile || isBusy}
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder={profile ? "e.g. What makes Jackson strong for this role?" : "Complete the gate to chat"}
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-white/40">
                        Powered by /api/chat and the portfolio_embeddings retrieval path.
                      </p>
                      <button
                        type="submit"
                        disabled={!profile || !input.trim() || isBusy}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isBusy ? "Streaming…" : "Send"}
                      </button>
                    </div>
                    {error ? <p className="mt-3 text-sm text-rose-300">{error.message}</p> : null}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </main>
  );
}
