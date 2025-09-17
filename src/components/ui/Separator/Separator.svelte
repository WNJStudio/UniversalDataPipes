<script>
    /**
     * @typedef {Object} SeparatorProps
     * @prop {"horizontal"|"vertical"} [orientation]
     */
    /** @type {SeparatorProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { orientation = "horizontal", ...props } = $props();
</script>

<div
    role="none"
    data-orientation={orientation}
    class={[
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        ,
        props.class,
    ]}
    {...props}
></div>
