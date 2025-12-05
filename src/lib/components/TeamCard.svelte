<script lang="ts">
  interface Props {
    name: string;
    role: string;
    quote?: string;
    imageUrl?: string;
  }

  let { name, role, quote = '', imageUrl }: Props = $props();
</script>

<div class="team-card">
  <!-- Photo placeholder -->
  <div class="photo-container">
    {#if imageUrl}
      <img src={imageUrl} alt={name} class="w-full h-full object-cover" />
    {:else}
      <!-- Placeholder with initials -->
      <div class="w-full h-full bg-gradient-primary flex items-center justify-center">
        <span class="text-white font-bold text-3xl md:text-4xl">
          {name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
    {/if}
  </div>

  <!-- Info -->
  <div class="info">
    <h3 class="font-manrope text-black text-xl md:text-2xl lg:text-3xl mb-1">
      {name}
    </h3>
    <p class="font-manrope text-black text-sm md:text-base lg:text-lg mb-3 opacity-80">
      {role}
    </p>
    {#if quote}
      <p class="font-manrope text-black text-xs md:text-sm opacity-60 italic">
        "{quote}"
      </p>
    {/if}
  </div>
</div>

<style>
  .team-card {
    background: white;
    border-radius: 25px;
    box-shadow: 0px 10px 100px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 280px;
    padding: 1.25rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 15px 120px rgba(0, 0, 0, 0.3);
  }

  .photo-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .info {
    text-align: left;
  }

  @media (min-width: 768px) {
    .team-card {
      max-width: 300px;
      padding: 1.5rem;
    }

    .photo-container {
      width: 120px;
      height: 120px;
    }
  }

  @media (min-width: 1024px) {
    .team-card {
      max-width: 320px;
    }

    .photo-container {
      width: 140px;
      height: 140px;
    }
  }
</style>

