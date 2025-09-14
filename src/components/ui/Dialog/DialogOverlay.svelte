<script>
    /**
     * @typedef {Object} DialogOverlayProps
     * @prop {boolean} hidden
     */

    import FadeOut from "../Transitions/FadeOut.svelte";

    /** @type {DialogOverlayProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { hidden, ...props } = $props();
</script>

<FadeOut
    {hidden}
    duration={150}
    {...props}
    class={["fixed inset-0 z-50 bg-black/80 transition-opacity", props.class]}
>
    {@render props.children?.()}
</FadeOut>
