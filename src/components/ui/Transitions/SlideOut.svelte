<script>
    import { slide } from "svelte/transition";

    /**
     * @typedef {Object} SlideOutProps
     * @prop {boolean} hidden
     * @prop {"x"|"y"} [axis]
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {import('svelte/transition').EasingFunction} [easing]
     */
    /** @type {SlideOutProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        hidden = false,
        axis = "x",
        delay = 0,
        duration = 300,
        easing,
        ...props
    } = $props();
</script>

{#if !hidden}
    <div
        transition:slide={{ axis, delay, duration, easing }}
        {...props}
        class={["", props.class]}
    >
        {@render props.children?.()}
    </div>
{/if}
