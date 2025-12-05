<script lang="ts">
  interface Props {
    stepNumber: number;
    title: string;
    description: string;
  }

  let { stepNumber, title, description }: Props = $props();

  // Get the first letter and rest of title for styling
  const firstLetter = $derived(title.charAt(0));
  const restOfTitle = $derived(title.slice(1));
</script>

<div class="step-card-wrapper">
  <div class="step-card-bg"></div>
  <div class="step-card-content">
    <!-- Step number -->
    <p class="font-manrope font-medium text-white text-lg md:text-xl mb-2">
      step {stepNumber}.
    </p>
    
    <!-- Divider line -->
    <div class="w-full h-px bg-white/30 mb-6"></div>
    
    <!-- Title with underlined first letter -->
    <h3 class="font-manrope text-white text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
      <span class="font-bold underline decoration-2 underline-offset-4">{firstLetter}</span><span class="font-normal">{restOfTitle}</span>
    </h3>
    
    <!-- Description -->
    <p class="font-manrope text-white text-sm md:text-base lg:text-lg leading-relaxed">
      {description}
    </p>
  </div>
</div>

<style>
  .step-card-wrapper {
    position: relative;
    width: 100%;
    max-width: 350px;
    min-height: 400px;
  }

  .step-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(102, 0, 232, 0.75), rgba(147, 43, 203, 0.75));
    filter: blur(7.5px);
    border-radius: 25px;
    z-index: -1;
  }

  .step-card-content {
    position: relative;
    padding: 1.5rem;
    height: 100%;
  }

  @media (min-width: 768px) {
    .step-card-wrapper {
      min-height: 450px;
    }

    .step-card-content {
      padding: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .step-card-wrapper {
      min-height: 500px;
    }

    .step-card-content {
      padding: 2.5rem;
    }
  }
</style>

