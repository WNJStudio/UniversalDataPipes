<script>
    /**
     * @typedef {Object} CardFooterProps
     * @prop {string} [p]
     */
    /** @type {CardFooterProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div {...props} class={["flex items-center p-6 pt-0", props.class]}>
    {@render props.children?.()}
</div>
