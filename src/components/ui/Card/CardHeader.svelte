<script>
    /**
     * @typedef {Object} CardHeaderProps
     * @prop {string} [p]
     */
    /** @type {CardHeaderProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div {...props} class={["flex flex-col space-y-1.5 p-6", props.class]}>
    {@render props.children?.()}
</div>
