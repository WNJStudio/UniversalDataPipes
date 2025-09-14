<script>
    import { fade } from "svelte/transition";

    /**
     * @typedef {Object} FadeOutProps
     * @prop {boolean} hidden
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {import('svelte/transition').EasingFunction} [easing]
     */
    /** @type {FadeOutProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        hidden = false,
        delay = 0,
        duration = 300,
        easing,
        ...props
    } = $props();
</script>

{#if !hidden}
    <div
        transition:fade={{ delay, duration, easing }}
        {...props}
        class={["", props.class]}
    >
        {@render props.children?.()}
    </div>
{/if}
