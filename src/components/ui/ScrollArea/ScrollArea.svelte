<script>
    /**
     * @typedef {Object} ScrollAreaProps
     * @prop {string} [p]
     */
    /** @type {ScrollAreaProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div class={["relative overflow-y-auto custom-scrollbar", props.class]}>
    {@render props.children?.()}
</div>
