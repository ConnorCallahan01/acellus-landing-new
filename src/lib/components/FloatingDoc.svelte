<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { createFloatingAnimation } from '$lib/utils/animations';

  type PositionValue = string | number;

  interface Props {
    rotation?: number;
    scale?: number;
    x?: PositionValue;
    y?: PositionValue;
    floatEnabled?: boolean;
    floatIntensity?: 'low' | 'medium' | 'high';
    zIndex?: number;
  }

  let {
    rotation = 0,
    scale = 1,
    x = '0%',
    y = '0%',
    floatEnabled = true,
    floatIntensity = 'medium',
    zIndex = 1,
  }: Props = $props();

  let docElement: HTMLElement;
  let floatAnimation: gsap.core.Tween | null = null;

  // Float intensity settings
  const intensitySettings = {
    low: { yRange: 10, xRange: 5, rotateRange: 2, duration: 4 },
    medium: { yRange: 20, xRange: 10, rotateRange: 5, duration: 3 },
    high: { yRange: 30, xRange: 15, rotateRange: 8, duration: 2 },
  };

  onMount(() => {
    if (docElement) {
      // Initial transform setup via GSAP to avoid conflicts
      gsap.set(docElement, {
        xPercent: -50,
        yPercent: -50,
        rotation: rotation,
        scale: scale
      });

      if (floatEnabled) {
        const settings = intensitySettings[floatIntensity];
        floatAnimation = createFloatingAnimation(docElement, settings);
      }
    }
  });

  onDestroy(() => {
    if (floatAnimation) {
      floatAnimation.kill();
    }
  });

  // Pause/resume animation (useful for performance)
  export function pauseAnimation() {
    if (floatAnimation) floatAnimation.pause();
  }

  export function resumeAnimation() {
    if (floatAnimation) floatAnimation.resume();
  }

  export function getElement() {
    return docElement;
  }

  function formatPosition(value: PositionValue) {
    return typeof value === 'number' ? `${value}%` : value;
  }
</script>

<div
  bind:this={docElement}
  class="floating-doc pointer-events-none"
  style="
    left: {formatPosition(x)};
    top: {formatPosition(y)};
    z-index: {zIndex};
  "
>
  <div class="doc-inner">
    <!-- Document background -->
    <div class="doc-bg"></div>
    
    <!-- Document "text" lines -->
    <div class="doc-lines">
      <!-- Header line (gray) -->
      <div class="line line-gray w-[85%]"></div>
      
      <!-- Gradient lines (important text) -->
      <div class="line line-gradient w-[78%]"></div>
      
      <!-- Gray lines (body text) -->
      <div class="line line-gray w-[70%]"></div>
      <div class="line line-gray w-[70%]"></div>
      
      <!-- Another gradient highlight -->
      <div class="line line-gradient w-[48%]"></div>
    </div>
  </div>
</div>

<style>
  .floating-doc {
    position: absolute;
    will-change: transform, left, top;
  }

  .doc-inner {
    position: relative;
    width: clamp(50px, 7vw, 120px);
    height: clamp(68px, 9vw, 165px);
  }

  .doc-bg {
    position: absolute;
    inset: 0;
    background: white;
    border: 2px solid #1f1f1f;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .doc-lines {
    position: absolute;
    top: 18%;
    left: 8%;
    right: 8%;
    display: flex;
    flex-direction: column;
    gap: clamp(3px, 0.55vw, 8px);
  }

  .line {
    height: clamp(2px, 0.4vw, 5px);
    border-radius: 2px;
  }

  .line-gray {
    background: #d9d9d9;
  }

  .line-gradient {
    background: linear-gradient(to right, #d166a1, #6600e7);
  }

</style>
