<script>
    /**
     * @typedef {Object} DialogHeaderProps
     * @prop {string} [p]
     */
    /** @type {DialogHeaderProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div
    {...props}
    class={["flex flex-col space-y-1.5 text-center sm:text-left", props.class]}
>
    {@render props.children?.()}
</div>
