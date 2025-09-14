<script>
    /**
     * @typedef {Object} DataViewProps
     * @prop {boolean} hidden
     */

    import BlurOut from "../../ui/Transitions/BlurOut.svelte";

    /** @type {DataViewProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { hidden, ...props } = $props();
</script>

<!-- TODO -->
<BlurOut class={["flex-1 relative", props.class]} {hidden}>
    {@render props.children?.()}
</BlurOut>
