<script>
    /**
     * @typedef {Object} DialogDescriptionProps
     * @prop {string} [p]
     */
    /** @type {DialogDescriptionProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<p {...props} class={["text-sm text-muted-foreground", props.class]}>
    {@render props.children?.()}
</p>
