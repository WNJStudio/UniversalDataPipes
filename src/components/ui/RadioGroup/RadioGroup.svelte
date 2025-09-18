<script>
    /**
     * @typedef {Object} RadioGroupProps
     * @prop {string} [p]
     */
    /** @type {RadioGroupProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
</script>

<div role="radiogroup" class={["grid gap-2", props.class]} {...props}>
    {@render props.children?.()}
</div>
