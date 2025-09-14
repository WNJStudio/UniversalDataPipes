<script>
    /**
     * @typedef {Object} CardContentProps
     * @prop {string} [p]
     */
    /** @type {CardContentProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div {...props} class={["p-6 pt-0", props.class]}>
    {@render props.children?.()}
</div>
