<script>
    import { fly } from "svelte/transition";

    /**
     * @typedef {Object} FlyOutProps
     * @prop {boolean} hidden
     * @prop {string|number} [x]
     * @prop {string|number} [y]
     * @prop {number} [opacity]
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {import('svelte/transition').EasingFunction} [easing]
     */
    /** @type {FlyOutProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        hidden = false,
        delay = 0,
        x,
        y,
        opacity,
        duration = 300,
        easing,
        ...props
    } = $props();
</script>

{#if !hidden}
    <div
        transition:fly={{ opacity, x, y, delay, duration, easing }}
        {...props}
        class={["", props.class]}
    >
        {@render props.children?.()}
    </div>
{/if}
