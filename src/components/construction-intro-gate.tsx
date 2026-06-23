"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { ConstructionOverlayScene } from "./construction-overlay-scene";

const EASE = [0.25, 0.4, 0.25, 1] as const;
const INTRO_HOLD_MS = 3200;
const EXIT_DURATION_S = 0.85;

export const COURSEWORK_CONSTRUCTION_SESSION_KEY =
  "lokeshwebsite-construction-intro-coursework";

const introListeners = new Set<() => void>();

function subscribeIntro(callback: () => void) {
  introListeners.add(callback);
  return () => {
    introListeners.delete(callback);
  };
}

function notifyIntroListeners() {
  introListeners.forEach((callback) => callback());
}

function readIntroSeen(sessionKey: string) {
  return sessionStorage.getItem(sessionKey) === "true";
}

function markIntroSeen(sessionKey: string) {
  sessionStorage.setItem(sessionKey, "true");
  notifyIntroListeners();
}

type ConstructionIntroGateProps = {
  children: ReactNode;
  sessionKey?: string;
};

export function ConstructionIntroGate({
  children,
  sessionKey = COURSEWORK_CONSTRUCTION_SESSION_KEY,
}: ConstructionIntroGateProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const introSeen = useSyncExternalStore(
    subscribeIntro,
    () => readIntroSeen(sessionKey),
    () => true,
  );
  const [introDismissed, setIntroDismissed] = useState(false);
  const [exitComplete, setExitComplete] = useState(false);

  const showOverlay = mounted && !introSeen && !introDismissed;
  const contentVisible = mounted && (introSeen || exitComplete);

  useEffect(() => {
    if (!showOverlay) {
      return;
    }

    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      markIntroSeen(sessionKey);
      setIntroDismissed(true);
    }, INTRO_HOLD_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [showOverlay, sessionKey]);

  const handleExitComplete = () => {
    setExitComplete(true);
    document.body.style.overflow = "";
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return (
    <>
      <div
        className={contentVisible ? undefined : "invisible"}
        aria-hidden={!contentVisible}
      >
        {children}
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {showOverlay && (
          <motion.div
            key="construction-intro"
            className="fixed inset-0 z-[60] bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: EXIT_DURATION_S, ease: EASE }}
          >
            <ConstructionOverlayScene />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
