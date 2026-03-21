import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Heart, LogOut, Send, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FamilyMember } from "./backend";
import { useGetAllMessages, useSendMessage } from "./hooks/useQueries";

const queryClient = new QueryClient();

const MEMBER_CONFIG: Record<
  FamilyMember,
  {
    name: string;
    role: string;
    color: string;
    textColor: string;
    initials: string;
  }
> = {
  [FamilyMember.marina]: {
    name: "Marina",
    role: "Mom",
    color: "oklch(0.52 0.09 185)",
    textColor: "#ffffff",
    initials: "M",
  },
  [FamilyMember.nik]: {
    name: "Nik",
    role: "Dad",
    color: "oklch(0.79 0.12 65)",
    textColor: "oklch(0.20 0.01 250)",
    initials: "N",
  },
  [FamilyMember.mariana]: {
    name: "Mariana",
    role: "Daughter",
    color: "oklch(0.43 0.12 305)",
    textColor: "#ffffff",
    initials: "Ma",
  },
};

const STORAGE_KEY = "familyMessengerMember";

function MemberSelectScreen({
  onSelect,
}: { onSelect: (m: FamilyMember) => void }) {
  const members = Object.entries(MEMBER_CONFIG) as [
    FamilyMember,
    (typeof MEMBER_CONFIG)[FamilyMember],
  ][];
  return (
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{ minHeight: "100dvh" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart
            className="w-6 h-6"
            style={{ color: "oklch(0.52 0.09 185)" }}
          />
          <h1 className="text-3xl font-bold text-foreground">Family Chat</h1>
          <Heart
            className="w-6 h-6"
            style={{ color: "oklch(0.52 0.09 185)" }}
          />
        </div>
        <p className="text-muted-foreground text-base">Who are you today?</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl">
        {members.map(([key, config], i) => (
          <motion.button
            key={key}
            data-ocid={`member.${key}.button`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(key)}
            className="bg-card rounded-2xl shadow-card border border-border p-7 flex flex-col items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ minHeight: "44px" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
              style={{ background: config.color, color: config.textColor }}
            >
              {config.initials}
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {config.name}
              </div>
              <div className="text-sm text-muted-foreground">{config.role}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function formatTime(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatApp({
  currentMember,
  onSwitch,
}: { currentMember: FamilyMember; onSwitch: () => void }) {
  const [text, setText] = useState("");
  const { data: messages = [], isLoading } = useGetAllMessages();
  const sendMessage = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (messages.length !== prevCountRef.current) {
      prevCountRef.current = messages.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    try {
      await sendMessage.mutateAsync({
        content: trimmed,
        sender: currentMember,
      });
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConfig = MEMBER_CONFIG[currentMember];
  const members = Object.entries(MEMBER_CONFIG) as [
    FamilyMember,
    (typeof MEMBER_CONFIG)[FamilyMember],
  ][];

  return (
    /* On mobile: full screen, no padding. On md+: centered with padding */
    <div
      className="flex items-center justify-center md:p-4"
      style={{ height: "100dvh" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        /* Mobile: full screen, no rounding. md+: card with rounded corners & max size */
        className="w-full bg-card border-border overflow-hidden flex
          h-full
          rounded-none border-0 shadow-none
          md:rounded-3xl md:border md:shadow-card md:max-w-4xl md:h-auto"
        style={{ maxHeight: "calc(100dvh - 2rem)" }}
      >
        {/* Left sidebar — hidden on mobile */}
        <aside
          className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-border"
          style={{ background: "oklch(0.96 0.01 145)" }}
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Family Members
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
            {members.map(([key, config]) => {
              const isCurrentUser = key === currentMember;
              return (
                <div
                  key={key}
                  data-ocid={`sidebar.${key}.item`}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isCurrentUser
                      ? "bg-white shadow-xs border border-border"
                      : "hover:bg-white/50"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: config.color,
                      color: config.textColor,
                    }}
                  >
                    {config.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {config.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {config.role}
                    </div>
                    {isCurrentUser && (
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.52 0.09 185)" }}
                      >
                        You
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-border">
            <Button
              data-ocid="sidebar.switch_member.button"
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-xl"
              onClick={onSwitch}
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Member
            </Button>
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header */}
          <header
            className="px-4 md:px-6 border-b border-border bg-card flex-shrink-0"
            style={{
              paddingTop: "max(1rem, env(safe-area-inset-top))",
              paddingBottom: "1rem",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: currentConfig.color,
                  color: currentConfig.textColor,
                }}
              >
                {currentConfig.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-foreground text-base">
                  Family Chat
                </h2>
                <p className="text-xs text-muted-foreground">
                  Marina, Nik &amp; Mariana
                </p>
              </div>
              {/* Switch member button on mobile */}
              <Button
                data-ocid="sidebar.switch_member.button"
                variant="ghost"
                size="sm"
                className="md:hidden gap-1.5 rounded-xl min-h-[44px] px-3"
                onClick={onSwitch}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Switch</span>
              </Button>
            </div>
          </header>

          {/* Messages — flex-1 + overflow-y-auto for proper mobile scroll */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4"
            style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {isLoading && (
              <div
                data-ocid="chat.loading_state"
                className="text-center text-muted-foreground text-sm py-8"
              >
                Loading messages…
              </div>
            )}
            {!isLoading && messages.length === 0 && (
              <div data-ocid="chat.empty_state" className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  No messages yet.
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Say hello to the family! 👋
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                  const cfg = MEMBER_CONFIG[msg.sender];
                  const isOwn = msg.sender === currentMember;
                  return (
                    <motion.div
                      key={String(msg.id)}
                      data-ocid={`chat.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-end gap-2 ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!isOwn && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-0.5"
                          style={{
                            background: cfg.color,
                            color: cfg.textColor,
                          }}
                        >
                          {cfg.initials}
                        </div>
                      )}
                      <div
                        className={`flex flex-col max-w-[75%] md:max-w-[68%] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {!isOwn && (
                          <span className="text-xs text-muted-foreground mb-1 ml-1">
                            {cfg.name}
                          </span>
                        )}
                        <div
                          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs"
                          style={{
                            background: cfg.color,
                            color: cfg.textColor,
                            borderBottomRightRadius: isOwn ? "4px" : "16px",
                            borderBottomLeftRadius: isOwn ? "16px" : "4px",
                          }}
                        >
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 mx-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      {isOwn && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-0.5"
                          style={{
                            background: cfg.color,
                            color: cfg.textColor,
                          }}
                        >
                          {cfg.initials}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div
            className="px-4 border-t border-border bg-card flex-shrink-0"
            style={{
              paddingTop: "0.75rem",
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            <form
              data-ocid="chat.composer.panel"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                data-ocid="chat.input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                className="flex-1 rounded-xl border-border bg-secondary text-[16px] min-h-[44px]"
                autoComplete="off"
              />
              <Button
                data-ocid="chat.submit_button"
                type="submit"
                disabled={!text.trim() || sendMessage.isPending}
                className="rounded-xl px-4 gap-1.5 min-h-[44px] min-w-[44px]"
                style={{ background: "oklch(0.52 0.09 185)", color: "#fff" }}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AppInner() {
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored &&
        Object.values(FamilyMember).includes(stored as FamilyMember)
      ) {
        return stored as FamilyMember;
      }
      return null;
    },
  );

  const handleSelect = (m: FamilyMember) => {
    localStorage.setItem(STORAGE_KEY, m);
    setCurrentMember(m);
  };

  const handleSwitch = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentMember(null);
  };

  return (
    <div style={{ background: "oklch(0.93 0.02 75)", minHeight: "100dvh" }}>
      <AnimatePresence mode="wait">
        {!currentMember ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MemberSelectScreen onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: "100dvh" }}
          >
            <ChatApp currentMember={currentMember} onSwitch={handleSwitch} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer — desktop only, hidden on mobile to avoid overlay */}
      <footer className="hidden md:block fixed bottom-0 left-0 right-0 py-2 text-center pointer-events-none">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <Heart
            className="inline w-3 h-3"
            style={{ color: "oklch(0.52 0.09 185)" }}
          />{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary pointer-events-auto"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster />
    </QueryClientProvider>
  );
}
