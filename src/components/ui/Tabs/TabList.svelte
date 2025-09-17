<script>
    import {
        DATAVIEW,
        getCurrentView,
        getViewChanger,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import TabTrigger from "./TabTrigger.svelte";

    /**
     * @typedef {Object} TabListProps
     * @prop {{value:PIPEVIEW|DATAVIEW, label:string}[]} tabs
     */
    /** @type {TabListProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { tabs = [], ...props } = $props();
    const currentView = getCurrentView();
    const viewChanger = getViewChanger();
</script>

<div
    class={[
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        props.class,
    ]}
>
    {#each tabs as tab}
        <TabTrigger
            value={tab.value}
            active={currentView() === tab.value}
            onclick={() => viewChanger(tab.value)}>{tab.label}</TabTrigger
        >
    {/each}
    {@render props.children?.()}
</div>
