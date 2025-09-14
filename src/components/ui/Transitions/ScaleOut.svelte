<script>
    import { scale } from "svelte/transition";

    /**
     * @typedef {Object} ScaleOutProps
     * @prop {boolean} hidden
     * @prop {number} [opacity]
     * @prop {number} [start]
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {import('svelte/transition').EasingFunction} [easing]
     */
    /** @type {ScaleOutProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        hidden = false,
        opacity,
        start,
        delay = 0,
        duration = 300,
        easing,
        ...props
    } = $props();
</script>

{#if !hidden}
    <div
        transition:scale={{ opacity, start, delay, duration, easing }}
        {...props}
        class={["", props.class]}
    >
        {@render props.children?.()}
    </div>
{/if}
