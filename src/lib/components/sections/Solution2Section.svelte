<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let sectionRef: HTMLElement;
  let dataCard: HTMLElement;
  let activeTab = $state(0);

  const tabs = [
    { id: 'risk', label: 'risk assessment' },
    { id: 'treatment', label: 'treatment alignment' },
    { id: 'gap', label: 'data gap analysis' },
    { id: 'rwd', label: 'queryable RWD' },
  ];

  // Sample data descriptions for each tab
  const tabDescriptions: Record<string, string> = {
    risk: 'pulling all critical health information from years of clinical reports and notes, providers can proactively detect risk in patient progression before it occurs - averting crises before they occur',
    treatment: 'aligning treatment plans with patient-specific data ensures personalized care pathways that maximize outcomes while minimizing adverse effects',
    gap: 'identifying missing data points across clinical workflows helps ensure comprehensive patient records for informed decision-making',
    rwd: 'structured real-world data enables powerful queries across patient populations for research and quality improvement',
  };

  function setActiveTab(index: number) {
    activeTab = index;
  }

  // Scroll progress determines which tab is shown (0-1 maps to tabs)
  export function updateTabFromProgress(progress: number) {
    const tabIndex = Math.min(Math.floor(progress * tabs.length), tabs.length - 1);
    if (tabIndex !== activeTab && tabIndex >= 0) {
      activeTab = tabIndex;
    }
  }

  export function getSectionRef() {
    return sectionRef;
  }

  export async function fadeIn() {
    if (!browser || !dataCard) return;
    const { gsap } = await import('gsap');
    gsap.fromTo(
      dataCard,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }
</script>

<section
  bind:this={sectionRef}
  data-section="3"
  class="section relative overflow-hidden"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Decorative curly braces -->
  <div class="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-[150px] md:text-[250px] lg:text-[400px] font-light leading-none select-none pointer-events-none opacity-60" style="background: linear-gradient(to bottom, #6600e7, #d166a1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    &#123;
  </div>
  <div class="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-[150px] md:text-[250px] lg:text-[400px] font-light leading-none select-none pointer-events-none opacity-60 rotate-180" style="background: linear-gradient(to bottom, #6600e7, #d166a1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    &#123;
  </div>

  <!-- Pink blur background -->
  <div
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-4xl aspect-[2/1] rounded-[40px]"
    style="background: rgba(225, 127, 163, 0.5); filter: blur(75px); z-index: 0;"
  ></div>

  <!-- Header text -->
  <div class="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 text-center z-10 px-4">
    <h2 class="font-manrope text-black text-lg md:text-2xl lg:text-3xl">
      proactivity becomes standard by
      <br />
      unlocking impossible data.
    </h2>
  </div>

  <!-- Data Card -->
  <div
    bind:this={dataCard}
    class="relative z-10 bg-white rounded-[30px] border-4 border-black shadow-card w-[92%] max-w-4xl mx-auto mt-28 md:mt-36"
  >
    <!-- Card header -->
    <div class="p-3 md:p-5 border-b-2 border-gray-200">
      <div class="flex items-center gap-3">
        <!-- Database icon -->
        <div class="w-8 h-8 md:w-10 md:h-10 rounded bg-gray-100 flex items-center justify-center">
          <svg class="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        <h3 class="font-manrope text-black text-base md:text-xl lg:text-2xl">
          the value of structured data
        </h3>
      </div>
    </div>

    <!-- Gray line separator -->
    <div class="mx-4 md:mx-6 h-[8px] bg-gray-300 rounded-full"></div>

    <!-- Tabs -->
    <div class="px-3 md:px-5 py-2 border-b border-gray-200">
      <!-- Thin gray line -->
      <div class="h-[3px] bg-gray-200 rounded-full mb-3"></div>
      <div class="flex flex-wrap gap-1 md:gap-3">
        {#each tabs as tab, i}
          <button
            onclick={() => setActiveTab(i)}
            class="relative px-2 md:px-4 py-1.5 font-manrope text-xs md:text-sm transition-all rounded-md
              {activeTab === i ? 'text-white font-bold' : 'text-black hover:text-purple-primary'}"
          >
            {#if activeTab === i}
              <span 
                class="absolute inset-0 rounded-md -z-10"
                style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(7.5px);"
              ></span>
            {/if}
            {tab.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Tab content area -->
    <div class="p-3 md:p-5 min-h-[250px] md:min-h-[350px] flex">
      <!-- Description panel -->
      <div class="w-1/3 pr-3 border-r border-gray-200">
        <!-- Stacked cards showing extracted data -->
        <div class="space-y-1 mb-3">
          <div class="bg-white border-2 border-black rounded-lg p-1.5 shadow-sm">
            <span class="text-xs md:text-sm font-manrope">risk of hypertension</span>
          </div>
          <div class="bg-white border-2 border-black rounded-lg p-1.5 shadow-sm ml-2 opacity-80">
            <span class="text-xs md:text-sm font-manrope text-gray-500">extracted data</span>
          </div>
        </div>
        <p class="font-manrope text-black text-[10px] md:text-xs leading-relaxed">
          {tabDescriptions[tabs[activeTab].id]}
        </p>
      </div>

      <!-- Data grid -->
      <div class="w-2/3 pl-3">
        <div class="grid grid-cols-3 gap-1.5 md:gap-2">
          {#each Array(18) as _, i}
            <div
              class="h-6 md:h-9 rounded-lg transition-all"
              style="background: rgba(217, 217, 217, {0.5 - i * 0.02}); opacity: {1 - i * 0.03};"
            ></div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-black">
    <svg class="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-sm">how do we get there?</span>
  </div>
</section>
