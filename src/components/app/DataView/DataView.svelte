<script>
    import { blur } from "svelte/transition";
    import {
        DATAVIEW,
        getCurrentView,
    } from "../../../context/SettingsContext.svelte";

    /** @type {import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
    const currentView = getCurrentView();
</script>

<!-- TODO -->
{#if currentView() === DATAVIEW}
    <div transition:blur class={["flex-1 relative", props.class]}>
        {@render props.children?.()}
    </div>
{/if}
