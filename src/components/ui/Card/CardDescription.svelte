<script>
    /**
     * @typedef {Object} CardDescriptionProps
     * @prop {string} [p]
     */
    /** @type {CardDescriptionProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div {...props} class={["text-sm text-muted-foreground", props.class]}>
    {@render props.children?.()}
</div>
