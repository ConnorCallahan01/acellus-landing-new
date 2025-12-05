<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import FloatingDoc from '$lib/components/FloatingDoc.svelte';

  let sectionRef: HTMLElement;
  let cloudElement: HTMLElement;
  let cloudElement2: HTMLElement;
  let centerContent: HTMLElement;
  let leftText: HTMLElement;
  let rightText: HTMLElement;

  // Documents positioned closer to center (cloud intake area)
  const documents = [
    { x: '18%', y: '52%', rotation: -15, scale: 0.9 },
    { x: '25%', y: '22%', rotation: -2, scale: 0.85 },
    { x: '28%', y: '72%', rotation: 23, scale: 0.8 },
    { x: '42%', y: '18%', rotation: -2, scale: 0.85 },
    { x: '62%', y: '28%', rotation: 25, scale: 0.95 },
    { x: '72%', y: '52%', rotation: 48, scale: 0.9 },
    { x: '65%', y: '72%', rotation: 170, scale: 0.85 },
    { x: '78%', y: '38%', rotation: 48, scale: 0.9 },
  ];

  onMount(async () => {
    if (!browser) return;
    const { gsap } = await import('gsap');
    // Initial state - elements start faded
    gsap.set([leftText, rightText], { opacity: 0 });
    gsap.set(centerContent, { opacity: 0, scale: 0.9 });
  });

  // Animate content in
  export async function animateIn() {
    if (!browser) return;
    const { gsap } = await import('gsap');
    
    const tl = gsap.timeline();
    
    tl.to(centerContent, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
    })
    .to([leftText, rightText], {
      opacity: 1,
      duration: 0.6,
      stagger: 0.2,
    }, '-=0.4');

    return tl;
  }

  // Morph cloud animation (called during scroll)
  export async function morphCloud(progress: number) {
    if (!browser || !cloudElement) return;
    const { gsap } = await import('gsap');
    
    const scale = 1 + progress * 0.3;
    const blur = 25 + progress * 50;
    
    gsap.set(cloudElement, {
      scale,
      filter: `blur(${blur}px)`,
    });
    if (cloudElement2) {
      gsap.set(cloudElement2, {
        scale: scale * 0.9,
        filter: `blur(${blur * 0.8}px)`,
      });
    }
  }

  export function getSectionRef() {
    return sectionRef;
  }

  export function getCloudElement() {
    return cloudElement;
  }
</script>

<section
  bind:this={sectionRef}
  data-section="2"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Background documents -->
  <div class="absolute inset-0 overflow-hidden">
    {#each documents as doc, i}
      <FloatingDoc
        x={doc.x}
        y={doc.y}
        rotation={doc.rotation}
        scale={doc.scale}
        floatEnabled={true}
        floatIntensity="low"
        zIndex={i + 1}
      />
    {/each}
  </div>

  <!-- Gradient blur "cloud" - two overlapping ellipses -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <!-- Primary ellipse -->
    <div
      bind:this={cloudElement}
      class="absolute w-[65%] max-w-3xl aspect-[1.3/1] rounded-[50%] z-5"
      style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(25px); transform: translateX(-10%);"
    ></div>
    <!-- Secondary ellipse (creates organic shape) -->
    <div
      bind:this={cloudElement2}
      class="absolute w-[45%] max-w-xl aspect-square rounded-full z-5"
      style="background: linear-gradient(135deg, #d166a1, #6600e7); filter: blur(30px); transform: translate(30%, -10%) rotate(39deg);"
    ></div>
  </div>

  <!-- Blurred background rect for center text -->
  <div
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] max-w-2xl aspect-[3/1] rounded-[385px] z-10"
    style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(25px);"
  ></div>

  <!-- Side text - Left -->
  <div
    bind:this={leftText}
    class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-28 md:w-40 lg:w-52 z-20"
  >
    <p class="font-manrope text-black text-xs md:text-base lg:text-xl leading-relaxed">
      taking in all the siloed, non-structured clinical data on a patient
    </p>
  </div>

  <!-- Side text - Right -->
  <div
    bind:this={rightText}
    class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-28 md:w-40 lg:w-52 z-20 text-right"
  >
    <p class="font-manrope text-black text-xs md:text-base lg:text-xl leading-relaxed">
      the ACE Engine uses AI to extract all critical data points for treatment decisions.
    </p>
  </div>

  <!-- Center content -->
  <div
    bind:this={centerContent}
    class="relative z-20 text-center px-4"
  >
    <p class="font-manrope text-white text-lg md:text-2xl lg:text-4xl mb-2 md:mb-4">
      this is why we've built the
    </p>
    <h2 class="font-manrope font-bold text-white text-3xl md:text-5xl lg:text-7xl text-glow">
      ACE Engine.
    </h2>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-black">
    <svg class="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-sm">what does structured data do?</span>
  </div>
</section>
