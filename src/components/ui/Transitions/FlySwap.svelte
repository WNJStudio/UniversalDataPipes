<script>
    import { fly } from "svelte/transition";

    /**
     * @typedef {Object} FlySwapProps
     * @prop {boolean} toggle
     * @prop {import('svelte').Snippet} a
     * @prop {import('svelte').Snippet} b
     * @prop {import('svelte/transition').FlyParams} [flyA]
     * @prop {import('svelte/transition').FlyParams} [flyB]
     */
    /** @type {FlySwapProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { toggle, a, b, flyA, flyB, ...props } = $props();
</script>

<div {...props} class={["grid", props.class]}>
    {#if toggle}
        <div transition:fly={flyB} class="col-span-full row-span-full">
            {@render b()}
        </div>
    {:else}
        <div transition:fly={flyA} class="col-span-full row-span-full">
            {@render a()}
        </div>
    {/if}
</div>
