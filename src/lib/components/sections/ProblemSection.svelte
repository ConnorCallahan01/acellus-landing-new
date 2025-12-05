<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import FloatingDoc from '$lib/components/FloatingDoc.svelte';

  let sectionRef: HTMLElement;
  let gradientBg: HTMLElement;
  let contentBox: HTMLElement;
  let svgLines: SVGSVGElement;
  let linePaths: SVGPathElement[] = [];

  // Document positions matching the Figma network layout
  const documents = [
    { x: '8%', y: '18%', rotation: -15, scale: 1, id: 'doc1' },      // Top left
    { x: '32%', y: '5%', rotation: -7, scale: 0.9, id: 'doc4' },     // Top center
    { x: '62%', y: '3%', rotation: 16, scale: 1, id: 'doc2' },       // Top right area
    { x: '5%', y: '70%', rotation: -15, scale: 0.95, id: 'doc3' },   // Bottom left
    { x: '62%', y: '75%', rotation: 12, scale: 1, id: 'doc5' },      // Bottom center-right
    { x: '85%', y: '55%', rotation: 33, scale: 1.05, id: 'doc6' },   // Right side
    { x: '88%', y: '18%', rotation: 22, scale: 0.9, id: 'doc7' },    // Top right corner
    { x: '65%', y: '88%', rotation: 12, scale: 0.85, id: 'doc8' },   // Bottom right
  ];

  // Line connections forming network between documents (matching Figma pattern)
  const lineConnections = [
    // Left side connections
    { from: { x: 12, y: 25 }, to: { x: 12, y: 55 } },
    { from: { x: 12, y: 55 }, to: { x: 8, y: 75 } },
    // Top connections
    { from: { x: 16, y: 22 }, to: { x: 34, y: 12 } },
    { from: { x: 40, y: 10 }, to: { x: 62, y: 8 } },
    // Right side upper
    { from: { x: 68, y: 8 }, to: { x: 88, y: 22 } },
    { from: { x: 90, y: 26 }, to: { x: 88, y: 55 } },
    // Right side lower
    { from: { x: 88, y: 60 }, to: { x: 72, y: 78 } },
    { from: { x: 68, y: 82 }, to: { x: 68, y: 92 } },
  ];

  onMount(async () => {
    if (!browser) return;
    
    const { gsap } = await import('gsap');
    
    // Initialize lines with strokeDashoffset for drawing animation
    linePaths.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }
    });
  });

  // Animate lines drawing
  export function animateLines(progress: number) {
    if (!browser) return;
    
    linePaths.forEach(async (path, i) => {
      if (!path) return;
      const { gsap } = await import('gsap');
      const length = path.getTotalLength();
      const delay = i * 0.1;
      const adjustedProgress = Math.max(0, Math.min((progress - delay) / (1 - delay * linePaths.length), 1));
      gsap.set(path, {
        strokeDashoffset: length * (1 - adjustedProgress),
      });
    });
  }

  // Fade in content
  export async function fadeInContent() {
    if (!browser || !contentBox) return;
    const { gsap } = await import('gsap');
    gsap.fromTo(
      contentBox,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }

  export function getSectionRef() {
    return sectionRef;
  }

  export function getGradientBg() {
    return gradientBg;
  }
</script>

<section
  bind:this={sectionRef}
  data-section="1"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Background documents -->
  <div class="absolute inset-0 overflow-hidden">
    {#each documents as doc}
      <FloatingDoc
        x={doc.x}
        y={doc.y}
        rotation={doc.rotation}
        scale={doc.scale}
        floatEnabled={false}
      />
    {/each}
  </div>

  <!-- SVG Lines connecting documents - network pattern -->
  <svg
    bind:this={svgLines}
    class="absolute inset-0 w-full h-full pointer-events-none z-5"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    {#each lineConnections as line, i}
      <path
        bind:this={linePaths[i]}
        d="M {line.from.x} {line.from.y} L {line.to.x} {line.to.y}"
        stroke="black"
        stroke-width="0.15"
        fill="none"
        stroke-linecap="round"
      />
    {/each}
  </svg>

  <!-- Center gradient background - matching Figma blur, reduced size -->
  <div
    bind:this={gradientBg}
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-2xl aspect-[2/1] rounded-[25px] z-10"
    style="background: linear-gradient(to bottom, rgba(102, 0, 231, 0.75), rgba(209, 102, 161, 0.75)); filter: blur(20px);"
  ></div>

  <!-- Content - reduced text sizes -->
  <div
    bind:this={contentBox}
    class="relative z-20 text-center px-4 max-w-3xl mx-auto"
  >
    <!-- Main stat -->
    <p class="font-manrope text-white text-base md:text-xl lg:text-2xl mb-2">
      every year cancer patients generate
    </p>
    <p class="font-manrope font-bold text-white text-lg md:text-2xl lg:text-3xl">
      <span class="underline decoration-2 underline-offset-4">&gt;2 billion pages</span> of clinical data.
    </p>

    <!-- Pain points -->
    <div class="mt-6 md:mt-8 space-y-1 md:space-y-2">
      <p class="font-manrope text-white text-sm md:text-lg lg:text-xl">
        this data it's <span class="font-bold underline">siloed</span>.
      </p>
      <p class="font-manrope text-white text-sm md:text-lg lg:text-xl">
        this data is <span class="font-bold underline">complex</span>.
      </p>
      <p class="font-manrope text-white text-sm md:text-lg lg:text-xl">
        this data is <span class="font-bold underline">unstructured</span>.
      </p>
    </div>
  </div>

  <!-- Scroll hint - matching Figma, reduced size -->
  <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 flex items-center gap-2 text-black">
    <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-xs md:text-sm">how do we solve this?</span>
  </div>
</section>
