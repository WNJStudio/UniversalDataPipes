<script>
    /**
     * @typedef {Object} TabTriggerProps
     * @prop {string} value
     * @prop {boolean} active
     */
    /** @type {TabTriggerProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { value, active = false, ...props } = $props();
</script>

<div
    {...props}
    data-value={value}
    data-state={active ? "active" : "inactive"}
    class={[
        "cursor-pointer select-none",
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
