<script>
    /**
     * @typedef {Object} ArrayOutputNodeProps
     * @prop {any[]} data
     */
    /** @type {ArrayOutputNodeProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { data, ...props } = $props();

    let preview = $state(data.length > 0 ? data[0] : undefined);

    const selectRandom = () => {
        if (data.length > 0) {
            // randomly select a row of data
            preview = data[0];
        } else {
            preview = undefined;
        }
    };
</script>

<div class="text-left p-2 bg-background/50 rounded-md">
    {#if preview}
        <pre class="text-xs text-foreground/80 whitespace-pre-wrap font-mono">
      {JSON.stringify(preview, null, 2)}
    </pre>
    {:else}
        <p class="text-sm text-center text-muted-foreground">
            Connect to preview output
        </p>
    {/if}
</div>
