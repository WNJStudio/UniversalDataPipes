<script>
    /**
     * @typedef {Object} ScrollAreaProps
     * @prop {string} [p]
     */
    /** @type {ScrollAreaProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div
    class={[
        "relative overflow-y-auto",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content",
        "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
