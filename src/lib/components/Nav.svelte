<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { currentSection } from '$lib/stores/scroll';

  // Reactive state
  let section = $derived($currentSection);
  let isExpanded = $derived(section === 0 || section === 7);
  
  // Get active nav item based on section
  function getActiveItem(sec: number): string {
    const items = ['cover', 'problem', 'solution', 'solution', 'howwework', 'team', 'newsroom', 'footer'];
    return items[sec] || 'cover';
  }
  
  let activeItem = $derived(getActiveItem(section));

  // DOM refs
  let navContainer: HTMLElement;

  // Navigation items
  const navItems = [
    { id: 'problem', label: 'Problem', section: 1 },
    { id: 'solution', label: 'Solution', section: 2 },
    { id: 'howwework', label: 'How We Work', section: 4 },
    { id: 'team', label: 'Our Team', section: 5 },
    { id: 'newsroom', label: 'Newsroom', section: 6 },
  ];

  // Check if item is active (solution covers sections 2-3)
  function isActive(itemId: string): boolean {
    if (itemId === 'solution') {
      return activeItem === 'solution';
    }
    return activeItem === itemId;
  }

  // Handle nav click - scroll to section
  function handleNavClick(sectionNum: number) {
    const sectionEl = document.querySelector(`[data-section="${sectionNum}"]`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Animate nav on state change
  $effect(() => {
    if (!browser || !navContainer) return;

    // Use CSS transitions instead of GSAP for simplicity
    if (isExpanded) {
      navContainer.style.width = '70%';
      navContainer.style.maxWidth = '1000px';
    } else {
      navContainer.style.width = '55%';
      navContainer.style.maxWidth = '600px';
    }
  });
</script>

<!-- Desktop Navigation -->
<nav
  bind:this={navContainer}
  class="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-nav shadow-nav hidden md:block transition-all duration-500 ease-out"
  style="width: {isExpanded ? '70%' : '55%'}; max-width: {isExpanded ? '1000px' : '600px'};"
>
  <div class="flex items-center justify-between px-4 py-2.5 gap-4">
    <!-- Logo Section -->
    <div class="flex items-center shrink-0">
      <!-- Full Logo (expanded state) -->
      <a href="/" class="transition-all duration-300" style="opacity: {isExpanded ? 1 : 0}; width: {isExpanded ? 'auto' : 0}; overflow: hidden;">
        <img 
          src="/acellus-logo.png" 
          alt="Acellus Health" 
          class="h-9 md:h-10 w-auto object-contain shrink-0"
        />
      </a>
      
      <!-- Icon Logo (collapsed state) -->
      <a href="/" class="transition-all duration-300" style="opacity: {isExpanded ? 0 : 1}; width: {isExpanded ? 0 : '40px'}; overflow: hidden;">
        <img 
          src="/acellus-logo.png" 
          alt="Acellus Health" 
          class="h-7 w-auto object-contain"
        />
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center gap-1 md:gap-2">
      {#each navItems as item}
        <button
          onclick={() => handleNavClick(item.section)}
          class="relative px-3 py-2 text-sm md:text-base font-manrope transition-all duration-300 rounded-button whitespace-nowrap
            {isActive(item.id) ? 'text-white font-bold' : 'text-black hover:text-purple-primary'}"
        >
          <!-- Gradient background for active item -->
          {#if isActive(item.id)}
            <span 
              class="absolute inset-0 rounded-button -z-10"
              style="background: linear-gradient(to bottom, #6600e7, #d166a1); filter: blur(12.5px);"
            ></span>
          {/if}
          {item.label}
        </button>
      {/each}
    </div>

    <!-- Contact Button (expanded state only) -->
    <div class="shrink-0 transition-all duration-300 overflow-hidden" style="opacity: {isExpanded ? 1 : 0}; width: {isExpanded ? 'auto' : 0};">
      <button class="btn-gradient-clear px-6 py-2 text-sm md:text-base whitespace-nowrap">
        Contact Us
      </button>
    </div>
  </div>
</nav>

<!-- Mobile Navigation -->
<nav class="md:hidden fixed top-4 left-4 right-4 z-50 bg-white rounded-nav shadow-nav">
  <div class="flex items-center justify-between px-4 py-2.5">
    <!-- Mobile Logo -->
    <a href="/">
      <img 
        src="/acellus-logo.png" 
        alt="Acellus Health" 
        class="h-8 w-auto object-contain"
      />
    </a>
    
    <!-- Mobile Menu Button -->
    <button class="p-2" aria-label="Toggle menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</nav>
