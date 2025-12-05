<script lang="ts">
  interface Props {
    title: string;
    summary: string;
    tags?: string[];
    date: string;
    imageUrl?: string;
    href?: string;
  }

  let { title, summary, tags = [], date, imageUrl, href = '#' }: Props = $props();
</script>

<a {href} class="article-card block">
  <div class="card-inner">
    <!-- Image -->
    <div class="image-container">
      {#if imageUrl}
        <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      {:else}
        <div class="w-full h-full bg-gradient-primary flex items-center justify-center">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="content">
      <h3 class="font-manrope text-black text-xl md:text-2xl lg:text-3xl mb-1">
        {title}
      </h3>
      
      {#if tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-2">
          {#each tags as tag}
            <span class="text-xs text-gray-500 font-manrope">[{tag}]</span>
          {/each}
        </div>
      {/if}
      
      <p class="font-manrope text-black text-sm md:text-base opacity-70">
        {summary}
      </p>
    </div>

    <!-- Date -->
    <div class="date-container">
      <span class="font-manrope text-black text-xs md:text-sm opacity-60">
        {date}
      </span>
    </div>
  </div>
</a>

<style>
  .article-card {
    background: white;
    border-radius: 25px;
    box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.25);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
  }

  .article-card:hover {
    transform: translateY(-3px);
    box-shadow: 0px 15px 120px rgba(0, 0, 0, 0.3);
  }

  .card-inner {
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }

  .image-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .date-container {
    flex-shrink: 0;
    text-align: right;
  }

  @media (min-width: 768px) {
    .card-inner {
      padding: 1.5rem;
      gap: 1.5rem;
    }

    .image-container {
      width: 100px;
      height: 100px;
    }
  }

  @media (min-width: 1024px) {
    .card-inner {
      padding: 2rem;
      gap: 2rem;
    }

    .image-container {
      width: 120px;
      height: 120px;
    }
  }
</style>

