<script>
    import { blur } from "svelte/transition";

    /**
     * @typedef {Object} BlurOutProps
     * @prop {boolean} hidden
     * @prop {number} [amount]
     * @prop {number} [opacity]
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {import('svelte/transition').EasingFunction} [easing]
     */
    /** @type {BlurOutProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        hidden = false,
        delay = 0,
        amount,
        opacity,
        duration = 300,
        easing,
        ...props
    } = $props();
</script>

{#if !hidden}
    <div
        transition:blur={{ amount, opacity, delay, duration, easing }}
        {...props}
        class={["", props.class]}
    >
        {@render props.children?.()}
    </div>
{/if}
