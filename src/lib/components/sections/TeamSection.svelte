<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import TeamCard from '$lib/components/TeamCard.svelte';

  let sectionRef: HTMLElement;
  let activeTeam = $state<'building' | 'advising'>('building');
  let cardsContainer: HTMLElement;

  // Team data
  const buildingTeam = [
    { name: 'patrick callahan', role: 'co-founder / CEO', quote: 'Building the future of cancer care' },
    { name: 'william rollins', role: 'AI engineer / CTO', quote: 'Making impossible data possible' },
    { name: 'connor callahan', role: 'AI engineer / COO', quote: 'Scaling solutions that matter' },
    { name: 'ashley respress', role: 'clinical nurse / CMO', quote: 'Bridging clinical and technical' },
  ];

  const advisingTeam = [
    { name: 'kris vaddi', role: 'co-founder / growth advisor', quote: 'Accelerating meaningful impact' },
    { name: 'steve sobieski', role: 'financial advisor / CFO', quote: 'Strategic financial guidance' },
    { name: 'eshan agarwal', role: 'technology advisor', quote: 'Technical excellence at scale' },
    { name: 'peg squire', role: 'clinical advisor', quote: 'Patient-centered innovation' },
  ];

  const currentTeam = $derived(activeTeam === 'building' ? buildingTeam : advisingTeam);

  function switchTeam(team: 'building' | 'advising') {
    if (team === activeTeam) return;
    
    // Animate out, switch, animate in
    gsap.to(cardsContainer, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        activeTeam = team;
        gsap.fromTo(
          cardsContainer,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 }
        );
      },
    });
  }

  export function getSectionRef() {
    return sectionRef;
  }

  export function revealCards() {
    gsap.fromTo(
      cardsContainer.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }
</script>

<section
  bind:this={sectionRef}
  data-section="5"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Header -->
  <div class="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 text-center z-10 px-4 w-full max-w-4xl">
    <h2 class="font-manrope text-black text-lg md:text-2xl lg:text-3xl leading-relaxed">
      we merge clinical experience and technological understanding
      <br class="hidden md:block" />
      <span class="font-bold">to personalize cancer care.</span>
    </h2>
  </div>

  <!-- Team Toggle -->
  <div class="absolute top-36 md:top-48 left-1/2 -translate-x-1/2 z-10">
    <div class="bg-white rounded-toggle shadow-toggle p-2 flex items-center gap-1">
      <button
        onclick={() => switchTeam('building')}
        class="relative px-4 md:px-6 py-2 font-manrope text-sm md:text-base transition-all rounded-md
          {activeTeam === 'building' ? 'text-white font-bold' : 'text-black'}"
      >
        {#if activeTeam === 'building'}
          <span 
            class="absolute inset-0 rounded-md -z-10"
            style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(7.5px);"
          ></span>
        {/if}
        building
      </button>
      
      <div class="w-px h-6 bg-gray-300"></div>
      
      <button
        onclick={() => switchTeam('advising')}
        class="relative px-4 md:px-6 py-2 font-manrope text-sm md:text-base transition-all rounded-md
          {activeTeam === 'advising' ? 'text-white font-bold' : 'text-black'}"
      >
        {#if activeTeam === 'advising'}
          <span 
            class="absolute inset-0 rounded-md -z-10"
            style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(7.5px);"
          ></span>
        {/if}
        advising
      </button>
    </div>
  </div>

  <!-- Team Cards -->
  <div
    bind:this={cardsContainer}
    class="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 px-4 mt-48 md:mt-56 max-w-6xl mx-auto"
  >
    {#each currentTeam as member (member.name)}
      <TeamCard
        name={member.name}
        role={member.role}
        quote={member.quote}
      />
    {/each}
  </div>

  <!-- CTA -->
  <div class="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 text-center z-10 px-4">
    <p class="font-manrope font-bold text-black text-lg md:text-2xl lg:text-3xl mb-6">
      obsessed with the problem? contact us.
    </p>
    <button class="btn-gradient-clear px-8 py-3 text-base md:text-lg">
      Join our Team
    </button>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-black">
    <svg class="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-sm">what're you doing today?</span>
  </div>
</section>

