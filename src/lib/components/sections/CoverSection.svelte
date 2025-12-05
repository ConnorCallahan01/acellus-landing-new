<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import FloatingDoc from '$lib/components/FloatingDoc.svelte';

  let sectionRef: HTMLElement;
  let blurOverlay: HTMLElement;
  let heroText: HTMLElement;

  // Document positions (percentage-based for responsiveness)
  // Positioned to match Figma layout more closely
  const documents = [
    { x: '8%', y: '12%', rotation: -15, scale: 1, intensity: 'low' as const },
    { x: '88%', y: '8%', rotation: 16, scale: 1, intensity: 'medium' as const },
    { x: '5%', y: '75%', rotation: -15, scale: 0.95, intensity: 'medium' as const },
    { x: '32%', y: '5%', rotation: -7, scale: 0.9, intensity: 'low' as const },
    { x: '68%', y: '78%', rotation: 12, scale: 1, intensity: 'high' as const },
    { x: '55%', y: '55%', rotation: 16, scale: 0.95, intensity: 'medium' as const },
    { x: '85%', y: '50%', rotation: 33, scale: 1.05, intensity: 'low' as const },
    { x: '88%', y: '22%', rotation: 22, scale: 0.9, intensity: 'high' as const },
    { x: '12%', y: '45%', rotation: -15, scale: 0.85, intensity: 'medium' as const },
  ];

  onMount(() => {
    // Initial animation - hero text fade in
    gsap.fromTo(
      heroText,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' }
    );
  });

  // Export refs for parent component to control
  export function getBlurOverlay() {
    return blurOverlay;
  }

  export function getSectionRef() {
    return sectionRef;
  }
</script>

<section
  bind:this={sectionRef}
  data-section="0"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Background with documents -->
  <div class="absolute inset-0 overflow-hidden">
    {#each documents as doc, i}
      <FloatingDoc
        x={doc.x}
        y={doc.y}
        rotation={doc.rotation}
        scale={doc.scale}
        floatIntensity={doc.intensity}
        zIndex={i + 1}
      />
    {/each}
  </div>

  <!-- Blur overlay - frosted glass effect matching Figma -->
  <div
    bind:this={blurOverlay}
    class="absolute inset-0 z-10"
    style="backdrop-filter: blur(12.5px); -webkit-backdrop-filter: blur(12.5px); background: rgba(145, 143, 143, 0.45);"
  ></div>

  <!-- Hero content - reduced text sizes -->
  <div class="relative z-20 text-center px-4 max-w-4xl mx-auto">
    <h1
      bind:this={heroText}
      class="font-manrope font-bold text-white text-xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight"
    >
      we use AI to extract critical data
      <br class="hidden md:block" />
      from medical histories to
      <br class="hidden md:block" />
      fuel personalized medicine.
    </h1>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
    <div class="flex flex-col items-center gap-2 text-white/70">
      <span class="text-sm font-manrope">Scroll to explore</span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    min-height: 100dvh;
  }
</style>
