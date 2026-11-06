"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { INTRO_SEEN_KEY } from "@/lib/coop";
import { CoopCard, type CardEntrance } from "./coop-card";
import type { Camera } from "./intro/coop-map";

/** Code-split: visitors who never see the intro never download it or MapLibre. */
const CoopIntro = dynamic(() => import("./intro/coop-intro").then((m) => m.CoopIntro), {
  ssr: false,
});

type Decision = "play" | "card" | "none";

let decision: Decision | null = null;

/**
 * Decided once per page load, on the client. The intro autoplays on the first
 * homepage visit of a browser session; ?intro=1 forces it and ?intro=0
 * suppresses it; reduced motion gets the card instead.
 * Cached at module scope so writing the session flag cannot unmount an intro
 * that has already started.
 */
function decide(): Decision {
  if (decision !== null) return decision;
  decision = "none";
  try {
    if (window.location.pathname !== "/") return decision;
    const param = new URLSearchParams(window.location.search).get("intro");
    if (param === "0") return decision;
    const seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    if (seen && param !== "1") return decision;
    decision = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "card" : "play";
  } catch {
    // Storage blocked: never risk replaying the intro on every page load.
    decision = "none";
  }
  return decision;
}

const subscribeNever = () => () => {};
const serverDecision = (): Decision => "none";

type CoopContextValue = {
  openCard: (trigger?: HTMLElement | null) => void;
  replayIntro: () => void;
};

const CoopContext = createContext<CoopContextValue | null>(null);

export function useCoop(): CoopContextValue {
  const context = useContext(CoopContext);
  if (!context) throw new Error("useCoop must be used inside CoopProvider");
  return context;
}

export function CoopProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auto = useSyncExternalStore(subscribeNever, decide, serverDecision);
  const [autoDone, setAutoDone] = useState(false);
  const [replayKey, setReplayKey] = useState<number | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [entrance, setEntrance] = useState<CardEntrance>("fade");
  const [handoff, setHandoff] = useState<Camera | null>(null);
  const [logoPending, setLogoPending] = useState(false);
  const [panelReady, setPanelReady] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const onHome = pathname === "/";
  const autoIntro = auto === "play" && !autoDone && onHome;
  const autoCard = auto === "card" && !autoDone && onHome;
  const introVisible = autoIntro || replayKey !== null;
  const cardVisible = cardOpen || autoCard;

  // Once the intro or the reduced-motion card has shown, this session has seen it.
  useEffect(() => {
    if (!autoIntro && !autoCard) return;
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Storage blocked: nothing to remember.
    }
  }, [autoIntro, autoCard]);

  /** Focus goes back to whatever opened the card, or to "Co-op news". */
  const restoreFocus = useCallback(() => {
    const target =
      triggerRef.current ?? document.querySelector<HTMLElement>("[data-coop-news]");
    triggerRef.current = null;
    window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }, []);

  /** The card on its own, with a plain entrance and its own map camera. */
  const showCard = useCallback(() => {
    setEntrance("fade");
    setHandoff(null);
    setLogoPending(false);
    setCardOpen(true);
  }, []);

  const openCard = useCallback(
    (trigger?: HTMLElement | null) => {
      triggerRef.current = trigger ?? null;
      showCard();
    },
    [showCard],
  );

  const closeCard = useCallback(() => {
    setCardOpen(false);
    setAutoDone(true);
    setReplayKey(null);
    setLogoPending(false);
    restoreFocus();
  }, [restoreFocus]);

  const replayIntro = useCallback(() => {
    setCardOpen(false);
    setAutoDone(true);
    setPanelReady(false);
    setReplayKey((key) => (key ?? 0) + 1);
  }, []);

  /** The intro hands off: the card appears and its map panel picks up the intro's final camera. */
  const onLanding = useCallback((camera: Camera | null) => {
    setEntrance("handoff");
    setHandoff(camera);
    setLogoPending(true);
    setPanelReady(false);
    setCardOpen(true);
  }, []);

  const onLogoLanded = useCallback(() => setLogoPending(false), []);
  const onPanelReady = useCallback(() => setPanelReady(true), []);

  /** Skip, from any frame, lands on the same card. */
  const onSkip = useCallback(() => {
    showCard();
    setAutoDone(true);
    setReplayKey(null);
  }, [showCard]);

  const onIntroEnd = useCallback(() => {
    setAutoDone(true);
    setReplayKey(null);
    setLogoPending(false);
  }, []);

  const value = useMemo(() => ({ openCard, replayIntro }), [openCard, replayIntro]);

  return (
    <CoopContext.Provider value={value}>
      {/* The page stays rendered underneath, but cannot be focused or read while something is on top. */}
      <div className="contents" inert={introVisible || cardVisible || undefined}>
        {children}
      </div>
      <CoopCard
        open={cardVisible}
        entrance={entrance}
        handoff={handoff}
        logoPending={logoPending}
        revealMap={!introVisible}
        onPanelReady={onPanelReady}
        onClose={closeCard}
        onReplay={replayIntro}
      />
      {introVisible && (
        <CoopIntro
          key={replayKey ?? "auto"}
          cardOpen={cardVisible}
          panelReady={panelReady}
          onLanding={onLanding}
          onLogoLanded={onLogoLanded}
          onSkip={onSkip}
          onEnd={onIntroEnd}
        />
      )}
    </CoopContext.Provider>
  );
}
