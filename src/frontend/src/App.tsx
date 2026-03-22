import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Heart, Lock, LogOut, Send, Trash2, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FamilyMember } from "./backend";
import {
  useDeleteMessage,
  useGetAllMessages,
  useSendMessage,
} from "./hooks/useQueries";

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
const NIK_PASSWORD = "Fart";

// Password modal for Nik
function NikPasswordModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === NIK_PASSWORD) {
      onConfirm();
    } else {
      setError("Wrong password");
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      key="nik-pw-backdrop"
      data-ocid="nik_password.modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 100, background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{
          duration: 0.25,
          type: "spring",
          stiffness: 320,
          damping: 26,
        }}
        className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-sm p-6 flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.79 0.12 65)",
                color: "oklch(0.20 0.01 250)",
              }}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base leading-tight">
                Enter Dad's password
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                To log in as Nik
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="nik_password.close_button"
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors mt-0.5"
            aria-label="Cancel"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Input
              ref={inputRef}
              data-ocid="nik_password.input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Password"
              className="rounded-xl text-[16px] min-h-[44px]"
              autoComplete="current-password"
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  key="pw-error"
                  data-ocid="nik_password.error_state"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs text-red-500 ml-1"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              data-ocid="nik_password.cancel_button"
              variant="outline"
              className="flex-1 rounded-xl min-h-[44px]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="nik_password.submit_button"
              className="flex-1 rounded-xl min-h-[44px]"
              style={{
                background: "oklch(0.79 0.12 65)",
                color: "oklch(0.20 0.01 250)",
              }}
            >
              Enter
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function MemberSelectScreen({
  onSelect,
}: { onSelect: (m: FamilyMember) => void }) {
  const [showNikModal, setShowNikModal] = useState(false);
  const members = Object.entries(MEMBER_CONFIG) as [
    FamilyMember,
    (typeof MEMBER_CONFIG)[FamilyMember],
  ][];

  const handleMemberClick = (key: FamilyMember) => {
    if (key === FamilyMember.nik) {
      setShowNikModal(true);
    } else {
      onSelect(key);
    }
  };

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
            onClick={() => handleMemberClick(key)}
            className="bg-card rounded-2xl shadow-card border border-border p-7 flex flex-col items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ minHeight: "44px" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-md relative"
              style={{ background: config.color, color: config.textColor }}
            >
              {config.initials}
              {key === FamilyMember.nik && (
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-card border border-border shadow-sm">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </span>
              )}
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

      {/* Nik password modal */}
      <AnimatePresence>
        {showNikModal && (
          <NikPasswordModal
            onConfirm={() => {
              setShowNikModal(false);
              onSelect(FamilyMember.nik);
            }}
            onCancel={() => setShowNikModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function formatTime(ts: bigint | undefined) {
  if (ts === undefined) return "";
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MemberList({
  currentMember,
  onSwitch,
  onClose,
}: {
  currentMember: FamilyMember;
  onSwitch: () => void;
  onClose?: () => void;
}) {
  const members = Object.entries(MEMBER_CONFIG) as [
    FamilyMember,
    (typeof MEMBER_CONFIG)[FamilyMember],
  ][];
  return (
    <>
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">
            Family Members
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            data-ocid="drawer.close_button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
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
    </>
  );
}

function ChatApp({
  currentMember,
  onSwitch,
}: { currentMember: FamilyMember; onSwitch: () => void }) {
  const [text, setText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: messages = [], isLoading } = useGetAllMessages();
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();
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

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMessage.mutateAsync(id);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConfig = MEMBER_CONFIG[currentMember];

  return (
    <div
      className="flex items-center justify-center md:p-4"
      style={{ height: "100dvh" }}
    >
      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="drawer-overlay"
              data-ocid="drawer.modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 md:hidden"
              style={{ zIndex: 50 }}
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-card flex flex-col border-r border-border md:hidden"
              style={{
                zIndex: 60,
                paddingTop: "env(safe-area-inset-top)",
              }}
            >
              <MemberList
                currentMember={currentMember}
                onSwitch={() => {
                  setDrawerOpen(false);
                  onSwitch();
                }}
                onClose={() => setDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
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
          <MemberList currentMember={currentMember} onSwitch={onSwitch} />
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
              {/* Members drawer toggle — mobile only */}
              <Button
                data-ocid="drawer.open_modal_button"
                variant="ghost"
                size="sm"
                className="md:hidden rounded-xl min-h-[44px] min-w-[44px] px-2"
                onClick={() => setDrawerOpen(true)}
                aria-label="Show family members"
              >
                <Users className="w-5 h-5" />
              </Button>

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
                data-ocid="chat.switch.button"
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

          {/* Messages */}
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
                  const msgId = String(msg.id);
                  const isHovered = hoveredId === msgId;
                  const isDeleting =
                    deleteMessage.isPending &&
                    deleteMessage.variables === msg.id;

                  return (
                    <motion.div
                      key={msgId}
                      data-ocid={`chat.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-end gap-2 group ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                      onMouseEnter={() => setHoveredId(msgId)}
                      onMouseLeave={() => setHoveredId(null)}
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
                            opacity: isDeleting ? 0.5 : 1,
                            transition: "opacity 0.2s",
                          }}
                        >
                          {msg.content}
                        </div>

                        {/* Timestamp + delete row */}
                        <div
                          className={`flex items-center gap-1 mt-1 mx-1 ${
                            isOwn ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <span className="text-xs text-muted-foreground">
                            {formatTime((msg as any).timestamp)}
                          </span>

                          {/* Delete button: always visible on touch, hover-reveal on desktop */}
                          <motion.button
                            type="button"
                            data-ocid={`chat.delete_button.${idx + 1}`}
                            onClick={() => handleDelete(msg.id)}
                            disabled={isDeleting}
                            aria-label="Delete message"
                            initial={false}
                            animate={{
                              opacity: isHovered ? 1 : 0,
                              scale: isHovered ? 1 : 0.8,
                            }}
                            transition={{ duration: 0.15 }}
                            className="
                              p-1 rounded-md
                              text-muted-foreground hover:text-red-500
                              hover:bg-red-50 dark:hover:bg-red-950/30
                              transition-colors
                              focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400
                              md:pointer-events-auto
                              [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100
                            "
                            style={{ minWidth: "24px", minHeight: "24px" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
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

      {/* Footer — desktop only */}
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
