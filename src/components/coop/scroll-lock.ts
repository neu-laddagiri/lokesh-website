/**
 * One page-scroll lock shared by the intro and the card. They overlap (the card
 * lands while the intro is still fading out), so each holds a lock and the page
 * scrolls again only when the last one lets go.
 */
let holders = 0;
let saved = "";

export function lockScroll(): () => void {
  const root = document.documentElement;
  if (holders === 0) {
    saved = root.style.overflow;
    root.style.overflow = "hidden";
  }
  holders += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) root.style.overflow = saved;
  };
}
