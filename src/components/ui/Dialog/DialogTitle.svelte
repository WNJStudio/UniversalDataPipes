<script>
    /**
     * @typedef {Object} DialogTitleProps
     * @prop {string} [p]
     */
    /** @type {DialogTitleProps & import('svelte/elements').SvelteHTMLElements['h2']} */
    let { ...props } = $props();
</script>

<h2
    {...props}
    class={["text-lg font-semibold leading-none tracking-tight", props.class]}
>
    {@render props.children?.()}
</h2>
