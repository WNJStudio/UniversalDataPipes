<script>
    import TabTrigger from "./TabTrigger.svelte";

    /**
     * @typedef {Object} TabListProps
     * @prop {{value:string, label:string}[]} tabs
     * @prop {(v:string)=>void} changer
     * @prop {string} currentValue
     */
    /** @type {TabListProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { tabs = [], currentValue, changer, ...props } = $props();
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
            active={currentValue === tab.value}
            onclick={() => changer(tab.value)}>{tab.label}</TabTrigger
        >
    {/each}
    {@render props.children?.()}
</div>
