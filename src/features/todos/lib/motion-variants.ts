/**
 * Centralized motion variants for todo list animations.
 * All variants respect reducedMotion: when true, transitions are instant (duration 0).
 */

export const listItemVariants = (reducedMotion: boolean) => ({
  initial: {
    opacity: reducedMotion ? 1 : 0,
    y: reducedMotion ? 0 : 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: reducedMotion ? 0 : 0.2 },
  },
  exit: {
    opacity: 0,
    x: reducedMotion ? 0 : -16,
    transition: { duration: reducedMotion ? 0 : 0.2 },
  },
});

export const listItemTransition = (index: number, reducedMotion: boolean) => ({
  delay: reducedMotion ? 0 : index * 0.04,
  duration: 0.2,
});

export const emptyStateVariants = (reducedMotion: boolean) => ({
  initial: {
    opacity: reducedMotion ? 1 : 0,
    y: reducedMotion ? 0 : 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: reducedMotion ? 0 : 0.3 },
  },
});

export const contentSwitchVariants = (reducedMotion: boolean) => ({
  initial: { opacity: reducedMotion ? 1 : 0 },
  animate: {
    opacity: 1,
    transition: { duration: reducedMotion ? 0 : 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: reducedMotion ? 0 : 0.1 },
  },
});

export const badgeVariants = (reducedMotion: boolean) => ({
  initial: {
    opacity: reducedMotion ? 1 : 0,
    scale: reducedMotion ? 1 : 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: reducedMotion ? 0 : 0.15 },
  },
  exit: {
    opacity: reducedMotion ? 1 : 0,
    scale: reducedMotion ? 1 : 0.9,
    transition: { duration: reducedMotion ? 0 : 0.1 },
  },
});
