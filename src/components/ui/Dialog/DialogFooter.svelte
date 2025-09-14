<script>
    /**
     * @typedef {Object} DialogFooterProps
     * @prop {string} [p]
     */
    /** @type {DialogFooterProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div
    {...props}
    class={[
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
