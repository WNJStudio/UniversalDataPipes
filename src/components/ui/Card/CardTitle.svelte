<script>
    /**
     * @typedef {Object} CardTitleProps
     * @prop {string} [p]
     */
    /** @type {CardTitleProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div
    {...props}
    class={[
        "text-2xl font-semibold leading-none tracking-tight select-none",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
