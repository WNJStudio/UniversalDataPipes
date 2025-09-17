<script>
    import {
        DATAVIEW,
        getCurrentView,
    } from "../../../context/SettingsContext.svelte";

    import BlurOut from "../../ui/Transitions/BlurOut.svelte";

    /** @type {import('svelte/elements').SvelteHTMLElements['div']} */
    let { ...props } = $props();
    const currentView = getCurrentView();
</script>

<!-- TODO -->
<BlurOut
    class={["flex-1 relative", props.class]}
    hidden={currentView() !== DATAVIEW}
>
    {@render props.children?.()}
</BlurOut>
