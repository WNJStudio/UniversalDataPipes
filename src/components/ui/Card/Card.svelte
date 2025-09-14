<script>
    /**
     * @typedef {Object} CardProps
     * @prop {string} [p]
     */
    /** @type {CardProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div
    {...props}
    class={[
        "rounded-lg border bg-card text-card-foreground shadow-xs",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
