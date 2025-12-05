<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { currentSection } from '$lib/stores/scroll';
  
  import Nav from '$lib/components/Nav.svelte';
  import FloatingDoc from '$lib/components/FloatingDoc.svelte';

  // Main container refs
  let pinnedContainer: HTMLElement;
  let scrollContainer: HTMLElement;
  
  // Content layer refs
  let coverContent: HTMLElement;
  let problemContent: HTMLElement;
  let solutionContent: HTMLElement;
  let solution2Content: HTMLElement;
  let howWeWorkContent: HTMLElement;
  let teamContent: HTMLElement;
  let newsroomContent: HTMLElement;
  let footerContent: HTMLElement;

  // Background layer refs
  let blurOverlay: HTMLElement;
  let linesContainer: SVGSVGElement;
  let gradientBg: HTMLElement;
  let cloudGradient: HTMLElement;

  // Document components refs
  let docComponents: any[] = [];

  // Layout configurations
  const problemLayout = [
    { x: 16, y: 47, rotation: -15, scale: 1.05, intensity: 'low' as const },
    { x: 8.5, y: 83, rotation: -15, scale: 1, intensity: 'medium' as const },
    { x: 51, y: 50, rotation: 16, scale: 1, intensity: 'medium' as const },
    { x: 32, y: 8, rotation: -7, scale: 0.95, intensity: 'low' as const },
    { x: 64, y: 4, rotation: 16, scale: 1.05, intensity: 'medium' as const },
    { x: 9, y: 13, rotation: -15, scale: 0.9, intensity: 'low' as const },
    { x: 67, y: 80, rotation: 12, scale: 1, intensity: 'high' as const },
    { x: 87, y: 63, rotation: 33, scale: 1.02, intensity: 'medium' as const },
    { x: 90, y: 25, rotation: 22, scale: 0.95, intensity: 'high' as const },
  ];

  // Scattered layout for Cover section (framing the center text)
  const coverLayout = [
    { x: 5, y: 35, rotation: -25, scale: 1.2 },
    { x: 15, y: 85, rotation: -10, scale: 1.1 },
    { x: 85, y: 45, rotation: 25, scale: 1.3 },
    { x: 25, y: 5, rotation: -15, scale: 1.0 },
    { x: 75, y: 8, rotation: 20, scale: 1.1 },
    { x: 5, y: 10, rotation: -20, scale: 1.15 },
    { x: 55, y: 88, rotation: 5, scale: 1.1 },
    { x: 92, y: 75, rotation: 40, scale: 1.2 },
    { x: 95, y: 15, rotation: 30, scale: 1.1 },
  ];

  // Cloud layout for Solution section (documents protruding from cloud edges)
  // Documents positioned at cloud boundaries - visible edges sticking out
  const solutionLayout = [
    { x: 20, y: 38, rotation: -20, scale: 0.85 },   // Left edge - protruding left
    { x: 28, y: 70, rotation: -25, scale: 0.8 },    // Bottom left - protruding down-left
    { x: 35, y: 15, rotation: -8, scale: 0.75 },    // Top left - protruding up
    { x: 50, y: 12, rotation: 5, scale: 0.7 },      // Top center - protruding up
    { x: 30, y: 25, rotation: -12, scale: 0.7 },    // Upper left edge
    { x: 50, y: 75, rotation: 0, scale: 0.75 },     // Bottom center - protruding down
    { x: 72, y: 65, rotation: 20, scale: 0.8 },     // Bottom right - protruding down-right
    { x: 80, y: 40, rotation: 35, scale: 0.85 },    // Right edge - protruding right
    { x: 65, y: 18, rotation: 12, scale: 0.75 },    // Top right - protruding up
  ];

  // Initial documents state (starting with Cover layout)
  const documents = problemLayout.map((doc, i) => ({
    ...doc,
    x: coverLayout[i].x,
    y: coverLayout[i].y,
    rotation: coverLayout[i].rotation,
    scale: coverLayout[i].scale,
    // Keep intensity from problem layout as it's consistent for the doc
    intensity: doc.intensity
  }));

  // Line connections for Problem section (based on problemLayout coordinates)
  const lineConnections = problemLayout.map((point, index) => {
    const next = problemLayout[(index + 1) % problemLayout.length];
    return {
      from: { x: point.x, y: point.y },
      to: { x: next.x, y: next.y },
    };
  });

  // Number of sections (for scroll calculation)
  const totalSections = 8;

  onMount(async () => {
    if (!browser) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    
    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 200));

    // Set initial states - hide all content except cover
    const contentLayers = [problemContent, solutionContent, solution2Content, howWeWorkContent, teamContent, newsroomContent, footerContent];
    contentLayers.forEach(layer => {
      if (layer) {
        layer.style.opacity = '0';
        layer.style.display = 'none';
      }
    });
    
    // Show cover content
    if (coverContent) {
      coverContent.style.opacity = '1';
      coverContent.style.display = 'flex';
    }
    
    // Set background layer initial states
    if (blurOverlay) blurOverlay.style.opacity = '1';
    if (linesContainer) linesContainer.style.opacity = '0';
    if (gradientBg) {
      gsap.set(gradientBg, {
        opacity: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 0.5
      });
    }

    // Initialize line paths for drawing animation
    const linePaths = linesContainer.querySelectorAll('path');
    linePaths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    // Create the master timeline for pinned scrolling
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalSections - 1)}`,
        scrub: 1,
        pin: pinnedContainer,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update current section based on progress
          const sectionIndex = Math.min(
            Math.floor(self.progress * totalSections),
            totalSections - 1
          );
          currentSection.set(sectionIndex);
        },
      },
    });

    // Square and cloud paths with matching structure for smooth morph
    // Square path: simple rectangle with matching control points for smooth morph
    const squarePath = "M 150,380 C 150,380 150,150 150,150 C 150,150 150,150 250,150 C 250,150 350,150 400,150 C 400,150 550,150 550,150 C 550,150 650,150 650,150 C 650,150 650,380 650,380 L 150,380 Z";
    
    // Cloud path: distinct rounded bumps matching the cloud icon
    const cloudPath = "M 150,380 C 150,380 150,340 190,320 C 170,280 200,240 250,240 C 250,200 290,170 350,170 C 380,150 420,150 450,170 C 510,170 550,200 550,240 C 600,240 630,280 610,320 C 650,340 650,380 650,380 L 150,380 Z";
    
    const morphShape = document.getElementById('morphShape');

    // ========================================
    // SECTION 0 → 1: Cover to Problem
    // ========================================
    masterTimeline
      // Fade out blur overlay
      .to(blurOverlay, { opacity: 0, duration: 0.3 }, 0)
      // Show lines and draw them
      .to(linesContainer, { opacity: 1, duration: 0.2 }, 0.1)
      .to(linePaths, { 
        strokeDashoffset: 0, 
        duration: 0.4,
        stagger: 0.03
      }, 0.1)
      // Fade out cover content
      .to(coverContent, { opacity: 0, duration: 0.2 }, 0.3)
      .set(coverContent, { display: 'none' }, 0.5)
      // Show gradient as square for Problem section
      .to(gradientBg, { 
        opacity: 1, 
        duration: 0.4,
        ease: 'power2.out'
      }, 0.4)
      // Set initial shape as square
      .set(morphShape, { attr: { d: squarePath } }, 0.4)
      // Fade in problem content
      .set(problemContent, { display: 'flex' }, 0.4)
      .to(problemContent, { opacity: 1, duration: 0.3 }, 0.5);

    // Animate documents from Cover to Problem layout
    docComponents.forEach((comp, i) => {
      const element = comp?.getElement();
      if (element && problemLayout[i]) {
        const target = problemLayout[i];
        masterTimeline.to(element, {
          left: `${target.x}%`,
          top: `${target.y}%`,
          rotation: target.rotation,
          scale: target.scale,
          duration: 0.5,
          ease: 'power1.inOut'
        }, 0); // Start at beginning of timeline
      }
    });

    // ========================================
    // SECTION 1 → 2: Problem to Solution
    // ========================================
    masterTimeline
      // Fade out lines
      .to(linesContainer, { opacity: 0, duration: 0.2 }, 1)
      // Start morphing shape from square to cloud
      .to(morphShape, {
        attr: { d: cloudPath },
        duration: 0.6,
        ease: 'power2.inOut'
      }, 1)
      // Fade out problem content while morphing
      .to(problemContent, { opacity: 0, duration: 0.3 }, 1.2)
      .set(problemContent, { display: 'none' }, 1.4)
      // Fade in solution content after morphing
      .set(solutionContent, { display: 'flex' }, 1.3)
      .to(solutionContent, { opacity: 1, duration: 0.3 }, 1.4);

    // Animate documents from Problem (network) to Solution (cloud edges)
    // Delayed start (1.4) so cloud fully forms first, slower duration (0.8) for smooth convergence
    docComponents.forEach((comp, i) => {
      const element = comp?.getElement();
      if (element && solutionLayout[i]) {
        const target = solutionLayout[i];
        masterTimeline.to(element, {
          left: `${target.x}%`,
          top: `${target.y}%`,
          rotation: target.rotation,
          scale: target.scale,
          duration: 0.8,
          ease: 'power2.out'
        }, 1.4); // Delayed start - cloud morphs first (1.0-1.6), then docs converge
      }
    });

    // ========================================
    // SECTION 2 → 3: Solution to Solution 2
    // ========================================
    masterTimeline
      // Fade out gradient
      .to(gradientBg, { opacity: 0, duration: 0.3 }, 2)
      // Fade out solution content
      .to(solutionContent, { opacity: 0, duration: 0.2 }, 2.2)
      .set(solutionContent, { display: 'none' }, 2.4)
      // Fade in solution2 content
      .set(solution2Content, { display: 'flex' }, 2.3)
      .to(solution2Content, { opacity: 1, duration: 0.3 }, 2.4);

    // ========================================
    // SECTION 3 → 4: Solution 2 to How We Work
    // ========================================
    masterTimeline
      .to(solution2Content, { opacity: 0, duration: 0.2 }, 3.2)
      .set(solution2Content, { display: 'none' }, 3.4)
      .set(howWeWorkContent, { display: 'flex' }, 3.3)
      .to(howWeWorkContent, { opacity: 1, duration: 0.3 }, 3.4);

    // ========================================
    // SECTION 4 → 5: How We Work to Team
    // ========================================
    masterTimeline
      .to(howWeWorkContent, { opacity: 0, duration: 0.2 }, 4.2)
      .set(howWeWorkContent, { display: 'none' }, 4.4)
      .set(teamContent, { display: 'flex' }, 4.3)
      .to(teamContent, { opacity: 1, duration: 0.3 }, 4.4);

    // ========================================
    // SECTION 5 → 6: Team to Newsroom
    // ========================================
    masterTimeline
      .to(teamContent, { opacity: 0, duration: 0.2 }, 5.2)
      .set(teamContent, { display: 'none' }, 5.4)
      .set(newsroomContent, { display: 'flex' }, 5.3)
      .to(newsroomContent, { opacity: 1, duration: 0.3 }, 5.4);

    // ========================================
    // SECTION 6 → 7: Newsroom to Footer
    // ========================================
    masterTimeline
      .to(newsroomContent, { opacity: 0, duration: 0.2 }, 6.2)
      .set(newsroomContent, { display: 'none' }, 6.4)
      .set(footerContent, { display: 'flex' }, 6.3)
      .to(footerContent, { opacity: 1, duration: 0.3 }, 6.4);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  });
</script>

<!-- Scroll container - this defines the scroll height -->
<div bind:this={scrollContainer} class="relative" style="height: {100 * totalSections}vh;">
  
  <!-- Pinned container - stays in viewport while scrolling -->
  <div 
    bind:this={pinnedContainer} 
    class="w-full h-screen overflow-hidden border-2 border-black"
    style="background: rgba(255, 255, 255, 0.11);"
  >
    <!-- Navigation -->
    <Nav />

    <!-- Background layer: Floating documents -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-[6]">
      {#each documents as doc, i}
        <FloatingDoc
          bind:this={docComponents[i]}
          x={doc.x}
          y={doc.y}
          rotation={doc.rotation}
          scale={doc.scale}
          floatIntensity={doc.intensity}
          zIndex={i + 1}
        />
      {/each}
    </div>

    <!-- Background layer: SVG Lines (for Problem section) -->
    <svg
      bind:this={linesContainer}
      class="absolute inset-0 w-full h-full pointer-events-none z-[5] opacity-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {#each lineConnections as line}
        <path
          d="M {line.from.x} {line.from.y} L {line.to.x} {line.to.y}"
          stroke="black"
          stroke-width="0.18"
          fill="none"
          stroke-linecap="round"
        />
      {/each}
    </svg>

    <!-- Background layer: Blur overlay (for Cover section) -->
    <div
      bind:this={blurOverlay}
      class="absolute inset-0 z-10"
      style="backdrop-filter: blur(12.5px); -webkit-backdrop-filter: blur(12.5px); background: rgba(145, 143, 143, 0.45);"
    ></div>

    <!-- Background layer: Single gradient that morphs from square to cloud -->
    <div
      bind:this={gradientBg}
      class="absolute left-1/2 top-1/2 z-[15] opacity-0 pointer-events-none overflow-hidden"
      style="width: min(85vw, 800px); aspect-ratio: 1.6 / 1; transform: translate(-50%, -50%);"
    >
      <!-- SVG with morphable shape -->
      <svg 
        viewBox="0 0 800 500" 
        class="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#6600e7;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#7722dd;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#9944cc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d166a1;stop-opacity:1" />
          </linearGradient>
          <filter id="cloudBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        <!-- Shape that morphs from square to cloud -->
        <path 
          id="morphShape"
          d=""
          fill="url(#cloudGradient)"
          filter="url(#cloudBlur)"
        />
      </svg>
      <!-- Soft outer glow -->
      <div 
        class="absolute inset-[-15%] w-[130%] h-[130%]"
        style="background: radial-gradient(ellipse 50% 45% at 50% 50%, rgba(209, 102, 161, 0.25) 0%, transparent 70%); filter: blur(25px);"
      ></div>
    </div>

    <!-- Content layers - only one visible at a time -->
    
    <!-- Cover Content -->
    <div 
      bind:this={coverContent}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center gap-12"
    >
      <div class="max-w-[min(92vw,1100px)] mx-auto">
        <p class="font-manrope font-bold text-white text-[clamp(2rem,5vw,4.8rem)] leading-[1.08] tracking-tight text-glow">
          <span class="block">we use AI to extract critical data</span>
          <span class="block">from medical histories to</span>
          <span class="block">fuel personalized medicine.</span>
        </p>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 uppercase tracking-[0.35em] text-[0.6rem]">
        <span class="font-manrope">scroll to explore</span>
        <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m0 0l-5-5m5 5 5-5" />
        </svg>
      </div>
    </div>

    <!-- Problem Content -->
    <div 
      bind:this={problemContent}
      class="absolute inset-0 z-20 flex items-center justify-center"
      style="opacity: 0; display: none;"
    >
      <div 
        class="text-center text-white px-6 py-8 overflow-hidden"
        style="width: min(85vw, 800px); aspect-ratio: 1.6 / 1; transform: translate(-50%, -50%); position: absolute; left: 50%; top: 50%;"
      >
        <div class="h-full flex flex-col items-center justify-center">
          <p class="font-manrope text-sm md:text-xl lg:text-[1.8rem] mb-4">
            every year cancer patients generate
          </p>
          <p class="font-manrope font-bold text-white text-base md:text-[2.2rem] lg:text-[2.5rem] leading-tight">
            <span class="underline decoration-2 underline-offset-8">&gt;2 billion pages of clinical data.</span>
          </p>
          <div class="mt-8 space-y-2 text-xs md:text-lg lg:text-xl">
            <p class="font-manrope">this data it's <span class="font-bold underline">siloed</span>.</p>
            <p class="font-manrope">this data is <span class="font-bold underline">complex</span>.</p>
            <p class="font-manrope">this data is <span class="font-bold underline">unstructured</span>.</p>
          </div>
        </div>
        
        <div class="absolute bottom-4 right-4 flex items-center gap-2 text-black">
          <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span class="font-manrope font-bold text-xs md:text-sm">how do we solve this?</span>
        </div>
      </div>
    </div>

    <!-- Solution Content -->
    <div 
      bind:this={solutionContent}
      class="absolute inset-0 z-20 flex items-center justify-center"
      style="opacity: 0; display: none;"
    >
      <div 
        class="relative overflow-hidden"
        style="width: min(85vw, 800px); aspect-ratio: 1.6 / 1; transform: translate(-50%, -50%); position: absolute; left: 50%; top: 50%;"
      >
        <!-- Left side text (narrower, positioned at edge) -->
        <p class="absolute left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 max-w-[100px] md:max-w-[130px] lg:max-w-[160px] font-manrope text-black text-[10px] md:text-sm lg:text-base leading-snug">
          taking in all the siloed, non-structured clinical data on a patient
        </p>
        
        <!-- Center content -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center px-4">
            <p class="font-manrope text-white/50 text-sm md:text-xl lg:text-2xl mb-2">this is why we've built the</p>
            <h2 class="font-manrope font-bold text-white text-3xl md:text-5xl lg:text-7xl" style="text-shadow: 0 15px 60px rgba(255,255,255,0.8);">ACE Engine.</h2>
          </div>
        </div>
        
        <!-- Right side text (narrower, positioned at edge) -->
        <p class="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 max-w-[100px] md:max-w-[130px] lg:max-w-[160px] font-manrope text-black text-[10px] md:text-sm lg:text-base leading-snug text-right">
          the ACE Engine uses AI to extract all critical data points for treatment decisions.
        </p>
        
        <!-- Scroll hint -->
        <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 text-black">
          <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span class="font-manrope font-bold text-xs md:text-sm">what does structured data do?</span>
        </div>
      </div>
    </div>

    <!-- Solution 2 Content -->
    <div 
      bind:this={solution2Content}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
      style="opacity: 0; display: none;"
    >
      <h2 class="font-manrope font-bold text-black text-lg md:text-2xl lg:text-3xl text-center mb-6 max-w-3xl">
        proactivity becomes standard by
        <br />
        <span class="text-gradient">unlocking impossible data.</span>
      </h2>
      <div class="bg-white rounded-card shadow-card p-4 md:p-6 max-w-2xl w-full">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs">
            {"{ }"}
          </div>
          <h3 class="font-manrope font-bold text-black text-sm md:text-base">the value of structured data</h3>
        </div>
        <div class="flex gap-2 mb-4 overflow-x-auto">
          <button class="px-3 py-1 rounded-full text-xs font-manrope bg-gradient-primary text-white">risk assessment</button>
          <button class="px-3 py-1 rounded-full text-xs font-manrope bg-gray-200 text-black">treatment alignment</button>
          <button class="px-3 py-1 rounded-full text-xs font-manrope bg-gray-200 text-black">data gap analysis</button>
          <button class="px-3 py-1 rounded-full text-xs font-manrope bg-gray-200 text-black">queryable RWD</button>
        </div>
        <p class="font-manrope text-black/70 text-xs md:text-sm">
          pulling all critical health information from years of clinical reports and notes, providers can proactively detect risk in patient progression before it occurs.
        </p>
      </div>
      <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 text-black">
        <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span class="font-manrope font-bold text-xs md:text-sm">how do we get there?</span>
      </div>
    </div>

    <!-- How We Work Content -->
    <div 
      bind:this={howWeWorkContent}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
      style="opacity: 0; display: none;"
    >
      <h2 class="font-manrope font-bold text-black text-lg md:text-2xl lg:text-3xl text-center mb-6">
        we partner with healthcare systems to:
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        <div class="bg-white rounded-card shadow-card p-4">
          <p class="text-gradient font-manrope text-xs mb-1">step 1.</p>
          <h3 class="font-manrope font-bold text-black text-base mb-2">address</h3>
          <p class="font-manrope text-black/70 text-xs">care drop-offs and operational inefficiencies by mapping provider workflows.</p>
        </div>
        <div class="bg-white rounded-card shadow-card p-4">
          <p class="text-gradient font-manrope text-xs mb-1">step 2.</p>
          <h3 class="font-manrope font-bold text-black text-base mb-2">curate</h3>
          <p class="font-manrope text-black/70 text-xs">AI solutions tailored to healthcare partner needs built on structured data.</p>
        </div>
        <div class="bg-white rounded-card shadow-card p-4">
          <p class="text-gradient font-manrope text-xs mb-1">step 3.</p>
          <h3 class="font-manrope font-bold text-black text-base mb-2">execute</h3>
          <p class="font-manrope text-black/70 text-xs">deployments through rigorous KPIs testing to prove immediate value.</p>
        </div>
      </div>
      <p class="font-manrope text-black/70 text-xs mt-4">all within the workflow of the EHR.</p>
      <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 text-black">
        <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span class="font-manrope font-bold text-xs md:text-sm">who's building this?</span>
      </div>
    </div>

    <!-- Team Content -->
    <div 
      bind:this={teamContent}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
      style="opacity: 0; display: none;"
    >
      <h2 class="font-manrope font-bold text-black text-lg md:text-xl lg:text-2xl text-center mb-6 max-w-3xl">
        we merge clinical experience and technological understanding
        <br />
        <span class="text-gradient">to personalize cancer care.</span>
      </h2>
      <div class="flex gap-2 mb-4">
        <button class="px-4 py-1 rounded-full text-xs font-manrope bg-gradient-primary text-white">building</button>
        <button class="px-4 py-1 rounded-full text-xs font-manrope bg-gray-200 text-black">advising</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full">
        <div class="bg-white rounded-card shadow-card p-3 text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-primary mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">pc</div>
          <h3 class="font-manrope font-bold text-black text-xs">patrick callahan</h3>
          <p class="font-manrope text-black/70 text-[10px]">co-founder / CEO</p>
        </div>
        <div class="bg-white rounded-card shadow-card p-3 text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-primary mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">wr</div>
          <h3 class="font-manrope font-bold text-black text-xs">william rollins</h3>
          <p class="font-manrope text-black/70 text-[10px]">AI engineer / CTO</p>
        </div>
        <div class="bg-white rounded-card shadow-card p-3 text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-primary mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">cc</div>
          <h3 class="font-manrope font-bold text-black text-xs">connor callahan</h3>
          <p class="font-manrope text-black/70 text-[10px]">AI engineer / COO</p>
        </div>
        <div class="bg-white rounded-card shadow-card p-3 text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-primary mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">ar</div>
          <h3 class="font-manrope font-bold text-black text-xs">ashley respress</h3>
          <p class="font-manrope text-black/70 text-[10px]">clinical nurse / CMO</p>
        </div>
      </div>
      <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 text-black">
        <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span class="font-manrope font-bold text-xs md:text-sm">what're you doing today?</span>
      </div>
    </div>

    <!-- Newsroom Content -->
    <div 
      bind:this={newsroomContent}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
      style="opacity: 0; display: none;"
    >
      <h2 class="font-manrope font-bold text-black text-lg md:text-xl lg:text-2xl text-center mb-6 max-w-3xl">
        the future of cancer care is near. read about the steps we've taken to get there.
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        <a href="#" class="bg-white rounded-card shadow-card overflow-hidden">
          <div class="h-24 bg-gray-200"></div>
          <div class="p-3">
            <h3 class="font-manrope font-bold text-black text-xs mb-1">article title #1</h3>
            <p class="font-manrope text-black/70 text-[10px]">How AI is transforming cancer care.</p>
            <p class="font-manrope text-black/50 text-[10px] mt-2">Dec 2024</p>
          </div>
        </a>
        <a href="#" class="bg-white rounded-card shadow-card overflow-hidden">
          <div class="h-24 bg-gray-200"></div>
          <div class="p-3">
            <h3 class="font-manrope font-bold text-black text-xs mb-1">article title #2</h3>
            <p class="font-manrope text-black/70 text-[10px]">Introducing the ACE Engine.</p>
            <p class="font-manrope text-black/50 text-[10px] mt-2">Nov 2024</p>
          </div>
        </a>
        <a href="#" class="bg-white rounded-card shadow-card overflow-hidden">
          <div class="h-24 bg-gray-200"></div>
          <div class="p-3">
            <h3 class="font-manrope font-bold text-black text-xs mb-1">article title #3</h3>
            <p class="font-manrope text-black/70 text-[10px]">Partnership announcement.</p>
            <p class="font-manrope text-black/50 text-[10px] mt-2">Oct 2024</p>
          </div>
        </a>
      </div>
      <div class="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 text-black">
        <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span class="font-manrope font-bold text-xs md:text-sm">interested? contact us.</span>
      </div>
    </div>

    <!-- Footer Content -->
    <div 
      bind:this={footerContent}
      class="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style="opacity: 0; display: none;"
    >
      <!-- CTA Banner -->
      <div class="w-full py-12 px-4 text-center" style="background: linear-gradient(to bottom, rgba(146, 44, 205, 0.95), rgba(215, 117, 168, 0.95));">
        <h2 class="font-manrope font-bold text-white text-lg md:text-2xl lg:text-3xl mb-3">
          we're ready to transform cancer care. <span class="underline">are you?</span>
        </h2>
        <p class="font-manrope text-white text-xs md:text-sm mb-4 max-w-lg mx-auto">
          let's work together to get your clinical data ready for personalized medicine.
        </p>
        <button class="bg-white rounded-toggle shadow-button px-6 py-2 text-gradient font-manrope font-bold text-sm underline">
          get in touch
        </button>
      </div>
      
      <!-- Footer Links -->
      <div class="w-full max-w-4xl mx-auto px-4 py-8">
        <div class="flex items-center gap-2 mb-6">
          <img src="/acellus-logo.png" alt="Acellus Health" class="h-8 w-auto" />
        </div>
        <div class="grid grid-cols-3 gap-6 text-xs">
          <div>
            <h3 class="font-manrope font-bold text-black mb-2">company</h3>
            <ul class="space-y-1 text-black/70">
              <li><a href="/about">about us</a></li>
              <li><a href="/careers">join our team</a></li>
              <li><a href="/contact">contact us</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-manrope font-bold text-black mb-2">legal</h3>
            <ul class="space-y-1 text-black/70">
              <li><a href="/privacy">privacy policy</a></li>
              <li><a href="/terms">terms of service</a></li>
              <li><a href="/faq">faq's</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-manrope font-bold text-black mb-2">connect</h3>
            <ul class="space-y-1 text-black/70">
              <li><a href="https://linkedin.com">linkedin</a></li>
              <li><a href="mailto:hello@acellus.health">email</a></li>
              <li><a href="https://x.com">x</a></li>
            </ul>
          </div>
        </div>
        <p class="font-manrope text-black/50 text-[10px] mt-6 text-center">© 2025 Acellus Health. All rights reserved.</p>
      </div>
    </div>

  </div>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }
</style>
