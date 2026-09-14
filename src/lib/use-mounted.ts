"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False while server rendering and during hydration, true immediately after.
 *
 * The course pages use this to hold their entry animations until the client has
 * taken over. Setting `initial` and `animate` together on first render is the
 * usual framer-motion pattern, but it schedules the transition through
 * requestAnimationFrame, and if those frames are deferred (a background tab, a
 * throttled renderer) the hero can sit at its initial opacity of zero. Flipping
 * a flag after hydration changes the `animate` prop instead, which lands on the
 * final value either way.
 *
 * This replaces a useState plus useEffect pair that tripped
 * react-hooks/set-state-in-effect. useSyncExternalStore does the same job with
 * no effect and no setState: it returns the server snapshot through hydration,
 * then re-renders once with the client snapshot.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
