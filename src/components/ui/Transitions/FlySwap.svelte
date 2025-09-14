<script>
    import FlyOut from "./FlyOut.svelte";

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
    <FlyOut class="col-span-full row-span-full" hidden={toggle} {...flyA}>
        {@render a()}
    </FlyOut>
    <FlyOut class="col-span-full row-span-full" hidden={!toggle} {...flyB}>
        {@render b()}
    </FlyOut>
</div>
