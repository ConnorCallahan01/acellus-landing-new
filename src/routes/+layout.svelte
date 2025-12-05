<script>
  import '../app.css';
  
  let { children } = $props();
</script>

<svelte:head>
  <title>Acellus Health - AI-Powered Cancer Care</title>
  <meta name="description" content="We use AI to extract critical data from medical histories to fuel personalized medicine." />
</svelte:head>

{@render children()}
