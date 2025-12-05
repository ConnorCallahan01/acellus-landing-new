<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionRef: HTMLElement;
  let ctaBanner: HTMLElement;
  let footerContent: HTMLElement;

  export function getSectionRef() {
    return sectionRef;
  }

  export function animateIn() {
    gsap.fromTo(
      ctaBanner,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo(
      footerContent,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 0.3 }
    );
  }
</script>

<section
  bind:this={sectionRef}
  data-section="7"
  class="section relative flex-col"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- CTA Banner -->
  <div
    bind:this={ctaBanner}
    class="relative z-10 w-full py-16 md:py-24 px-4 mt-20 md:mt-28"
    style="background: linear-gradient(to bottom, rgba(146, 44, 205, 0.95), rgba(215, 117, 168, 0.95)); filter: blur(0); margin-left: -2px; margin-right: -2px; width: calc(100% + 4px);"
  >
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="font-manrope font-bold text-white text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
        we're ready to transform cancer care. <span class="underline decoration-2 underline-offset-4">are you?</span>
      </h2>
      <p class="font-manrope text-white text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
        let's work together to get your clinical data ready for personalized medicine.
        <br />
        contact us to get started.
      </p>
      <button class="bg-white rounded-toggle shadow-button px-6 md:px-8 py-3 md:py-4 text-gradient font-manrope font-bold text-lg md:text-xl underline decoration-2 underline-offset-2 hover:shadow-lg transition-shadow">
        get in touch
      </button>
    </div>
  </div>

  <!-- Footer Content -->
  <div
    bind:this={footerContent}
    class="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 py-12 md:py-16"
  >
    <!-- Logo -->
    <div class="mb-8 md:mb-12">
      <a href="/">
        <img 
          src="/acellus-logo.png" 
          alt="Acellus Health" 
          class="h-12 md:h-14 w-auto object-contain"
        />
      </a>
    </div>

    <!-- Links Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
      <!-- Company -->
      <div>
        <h3 class="font-manrope font-bold text-black text-base md:text-lg mb-4">company</h3>
        <ul class="space-y-2">
          <li><a href="/about" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">about us</a></li>
          <li><a href="/careers" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">join our team</a></li>
          <li><a href="/contact" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">contact us</a></li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h3 class="font-manrope font-bold text-black text-base md:text-lg mb-4">legal</h3>
        <ul class="space-y-2">
          <li><a href="/privacy" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">privacy policy</a></li>
          <li><a href="/terms" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">terms of service</a></li>
          <li><a href="/faq" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">faq's</a></li>
        </ul>
      </div>

      <!-- Connect -->
      <div>
        <h3 class="font-manrope font-bold text-black text-base md:text-lg mb-4">connect</h3>
        <ul class="space-y-2">
          <li><a href="https://linkedin.com" target="_blank" rel="noopener" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">linkedin</a></li>
          <li><a href="mailto:hello@acellus.health" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">email</a></li>
          <li><a href="https://x.com" target="_blank" rel="noopener" class="font-manrope text-black text-sm md:text-base hover:text-purple-primary transition-colors">x</a></li>
        </ul>
      </div>

      <!-- Empty column for spacing on larger screens -->
      <div class="hidden md:block"></div>
    </div>

    <!-- Divider -->
    <div class="w-full h-px bg-black/20 mb-6"></div>

    <!-- Copyright -->
    <p class="font-manrope text-black text-sm text-center opacity-60">
      © 2025 Acellus Health. All rights reserved.
    </p>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>

