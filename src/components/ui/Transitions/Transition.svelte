<script>
    /**
     * @typedef {Object} TransitionProps
     * @prop {boolean} hidden
     * @prop {(node:any, cp:any)=>import('svelte/transition').TransitionConfig} fun
     * @prop {Object} [transitionProps]
     */
    /** @type {TransitionProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { hidden = false, fun, transitionProps, ...props } = $props();
</script>

{#if !hidden}
    <div transition:fun={transitionProps} {...props} class={["", props.class]}>
        {@render props.children?.()}
    </div>
{/if}
