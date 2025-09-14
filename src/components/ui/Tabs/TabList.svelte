<script>
    import { DATAVIEW, PIPEVIEW } from "../../../constants";
    import TabTrigger from "./TabTrigger.svelte";

    /**
     * @typedef {Object} TabListProps
     * @prop {PIPEVIEW|DATAVIEW} currentView
     * @prop {{value:PIPEVIEW|DATAVIEW, label:string}[]} tabs
     */
    /** @type {TabListProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { currentView = $bindable(), tabs = [], ...props } = $props();
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
            active={currentView === tab.value}
            onclick={() => (currentView = tab.value)}>{tab.label}</TabTrigger
        >
    {/each}
    {@render props.children?.()}
</div>
