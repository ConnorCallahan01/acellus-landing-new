<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import StepCard from '$lib/components/StepCard.svelte';

  let sectionRef: HTMLElement;
  let cardsContainer: HTMLElement;
  let card1: HTMLElement;
  let card2: HTMLElement;
  let card3: HTMLElement;
  let footerText: HTMLElement;

  const steps = [
    {
      number: 1,
      title: 'address',
      description: 'care drop-offs and operational inefficiencies by mapping provider and leadership workflows.',
    },
    {
      number: 2,
      title: 'curate',
      description: 'AI solutions tailored to the needs of the healthcare partner built on top of the structured data transformed by the ACE Engine.',
    },
    {
      number: 3,
      title: 'execute',
      description: 'on deployments of AI solutions through rigorous KPIs testing to prove immediate value to scale the solution system-wide.',
    },
  ];

  onMount(() => {
    // Set initial state - cards hidden
    gsap.set([card1, card2, card3], { opacity: 0, y: 50 });
    gsap.set(footerText, { opacity: 0 });
  });

  // Stagger cards in based on scroll progress
  export function animateCards(progress: number) {
    // Card 1 appears from 0-0.33
    const card1Progress = Math.min(progress / 0.33, 1);
    gsap.set(card1, {
      opacity: card1Progress,
      y: 50 * (1 - card1Progress),
    });

    // Card 2 appears from 0.33-0.66
    const card2Progress = Math.max(0, Math.min((progress - 0.33) / 0.33, 1));
    gsap.set(card2, {
      opacity: card2Progress,
      y: 50 * (1 - card2Progress),
    });

    // Card 3 appears from 0.66-1
    const card3Progress = Math.max(0, Math.min((progress - 0.66) / 0.34, 1));
    gsap.set(card3, {
      opacity: card3Progress,
      y: 50 * (1 - card3Progress),
    });

    // Footer text fades in at the end
    const footerProgress = Math.max(0, (progress - 0.9) / 0.1);
    gsap.set(footerText, { opacity: footerProgress });
  }

  // Animate all cards at once (alternative mode)
  export function revealAllCards() {
    gsap.to([card1, card2, card3], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
    });
    gsap.to(footerText, {
      opacity: 1,
      duration: 0.5,
      delay: 0.5,
    });
  }

  export function getSectionRef() {
    return sectionRef;
  }
</script>

<section
  bind:this={sectionRef}
  data-section="4"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Header -->
  <div class="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 text-center z-10 px-4">
    <h2 class="font-manrope text-black text-xl md:text-3xl lg:text-4xl">
      we partner with healthcare systems to:
    </h2>
  </div>

  <!-- Step Cards -->
  <div
    bind:this={cardsContainer}
    class="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 px-4 mt-24 md:mt-32"
  >
    <div bind:this={card1}>
      <StepCard
        stepNumber={steps[0].number}
        title={steps[0].title}
        description={steps[0].description}
      />
    </div>
    <div bind:this={card2}>
      <StepCard
        stepNumber={steps[1].number}
        title={steps[1].title}
        description={steps[1].description}
      />
    </div>
    <div bind:this={card3}>
      <StepCard
        stepNumber={steps[2].number}
        title={steps[2].title}
        description={steps[2].description}
      />
    </div>
  </div>

  <!-- Footer text -->
  <div
    bind:this={footerText}
    class="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 text-center z-10 px-4"
  >
    <p class="font-manrope font-bold text-black text-lg md:text-2xl lg:text-3xl">
      all within the workflow of the EHR.
    </p>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-black">
    <svg class="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-sm">who's building this?</span>
  </div>
</section>

