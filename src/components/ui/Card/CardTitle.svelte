<script>
    /**
     * @typedef {Object} CardTitleProps
     * @prop {import('svelte/attachments').Attachment} [attach]
     */
    /** @type {CardTitleProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { attach, ...props } = $props();
</script>

<div
    {...props}
    {@attach attach}
    class={[
        "text-2xl font-semibold leading-none tracking-tight select-none",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
