<script>
    import { fade } from "svelte/transition";

    /**
     * @typedef {Object} DialogOverlayProps
     * @prop {boolean} hidden
     */

    /** @type {DialogOverlayProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { hidden, ...props } = $props();
</script>

{#if !hidden}
    <div
        transition:fade={{ duration: 150 }}
        {...props}
        class={[
            "fixed inset-0 z-50 bg-black/80 transition-opacity",
            props.class,
        ]}
    >
        {@render props.children?.()}
    </div>
{/if}
