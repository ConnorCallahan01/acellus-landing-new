<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import ArticleCard from '$lib/components/ArticleCard.svelte';

  let sectionRef: HTMLElement;
  let articlesContainer: HTMLElement;

  // Sample articles
  const articles = [
    {
      title: 'article title #1',
      summary: 'How AI is transforming cancer care with structured data extraction.',
      tags: ['AI', 'Healthcare'],
      date: 'Dec 2024',
    },
    {
      title: 'article title #2',
      summary: 'Introducing the ACE Engine: Our approach to medical data.',
      tags: ['Product', 'Launch'],
      date: 'Nov 2024',
    },
    {
      title: 'article title #3',
      summary: 'Partnership announcement with leading healthcare systems.',
      tags: ['Partnership'],
      date: 'Oct 2024',
    },
  ];

  export function getSectionRef() {
    return sectionRef;
  }

  export function revealArticles() {
    gsap.fromTo(
      articlesContainer.children,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }
    );
  }
</script>

<section
  bind:this={sectionRef}
  data-section="6"
  class="section relative"
  style="background: rgba(255, 255, 255, 0.11); border: 2px solid black;"
>
  <!-- Header -->
  <div class="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 text-center z-10 px-4 w-full max-w-5xl">
    <h2 class="font-manrope text-black text-lg md:text-2xl lg:text-3xl">
      the future of cancer care is near. read about the steps we've taken to get there.
    </h2>
  </div>

  <!-- Articles -->
  <div
    bind:this={articlesContainer}
    class="relative z-10 flex flex-col gap-4 md:gap-6 px-4 mt-32 md:mt-40 w-full max-w-4xl mx-auto"
  >
    {#each articles as article}
      <ArticleCard
        title={article.title}
        summary={article.summary}
        tags={article.tags}
        date={article.date}
      />
    {/each}
  </div>

  <!-- CTA Button -->
  <div class="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-10">
    <button class="btn-gradient-clear px-8 py-3 text-base md:text-lg">
      Read All News
    </button>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-black">
    <svg class="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
    <span class="font-manrope font-bold text-sm">interested? contact us.</span>
  </div>
</section>

