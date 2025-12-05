import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Floating animation for documents
export function createFloatingAnimation(
  element: HTMLElement,
  options: {
    yRange?: number;
    xRange?: number;
    rotateRange?: number;
    duration?: number;
  } = {}
) {
  const { yRange = 20, xRange = 10, rotateRange = 5, duration = 3 } = options;

  return gsap.to(element, {
    y: `random(-${yRange}, ${yRange})`,
    x: `random(-${xRange}, ${xRange})`,
    rotation: `random(-${rotateRange}, ${rotateRange})`,
    duration: duration + Math.random() * 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    repeatRefresh: true,
  });
}

// Fade in animation
export function fadeIn(
  element: HTMLElement | HTMLElement[],
  options: {
    duration?: number;
    delay?: number;
    y?: number;
    stagger?: number;
  } = {}
) {
  const { duration = 0.8, delay = 0, y = 30, stagger = 0.1 } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power2.out',
    }
  );
}

// Fade out animation
export function fadeOut(
  element: HTMLElement | HTMLElement[],
  options: {
    duration?: number;
    delay?: number;
    y?: number;
  } = {}
) {
  const { duration = 0.5, delay = 0, y = -20 } = options;

  return gsap.to(element, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power2.in',
  });
}

// Line drawing animation (for SVG paths)
export function drawLine(
  path: SVGPathElement,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  const { duration = 1, delay = 0, ease = 'power2.inOut' } = options;
  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  return gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease,
  });
}

// Morph animation (scale + border-radius)
export function morphShape(
  element: HTMLElement,
  options: {
    toScale?: number;
    toBorderRadius?: string;
    duration?: number;
  } = {}
) {
  const { toScale = 1.5, toBorderRadius = '50%', duration = 1 } = options;

  return gsap.to(element, {
    scale: toScale,
    borderRadius: toBorderRadius,
    duration,
    ease: 'power2.inOut',
  });
}

// Stagger animation for multiple elements
export function staggerReveal(
  elements: HTMLElement[],
  options: {
    duration?: number;
    stagger?: number;
    y?: number;
    x?: number;
  } = {}
) {
  const { duration = 0.6, stagger = 0.15, y = 50, x = 0 } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y, x },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      stagger,
      ease: 'power3.out',
    }
  );
}

// Create scroll-triggered section
export function createSectionTrigger(
  trigger: HTMLElement,
  options: {
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
    onUpdate?: (progress: number) => void;
    pinDuration?: string;
    scrub?: boolean | number;
  } = {}
) {
  const {
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    onUpdate,
    pinDuration = '+=100%',
    scrub = 1,
  } = options;

  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: pinDuration,
    pin: true,
    scrub,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    onUpdate: (self) => {
      if (onUpdate) onUpdate(self.progress);
    },
  });
}

// Timeline helper for complex animations
export function createTimeline(options: gsap.TimelineVars = {}) {
  return gsap.timeline({
    paused: true,
    ...options,
  });
}

// Utility to kill all ScrollTriggers (useful for cleanup)
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

// Refresh ScrollTrigger (useful after layout changes)
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

