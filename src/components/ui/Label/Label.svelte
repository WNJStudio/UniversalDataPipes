<script>
    /**
     * @typedef {Object} LabelProps
     * @prop {string} [p]
     */
    /** @type {LabelProps & import('svelte/elements').HTMLLabelAttributes} */
    let { ...props } = $props();
</script>

<label
    {...props}
    class={[
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        props.class,
    ]}
>
    {@render props.children?.()}
</label>
