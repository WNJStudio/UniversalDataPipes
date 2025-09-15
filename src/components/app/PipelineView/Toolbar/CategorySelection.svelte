<script>
    import { NodeDefs } from "../../../../model/Node.svelte";
    import Button from "../../../ui/Button/Button.svelte";

    /**
     * @typedef {Object} CategorySelectionProps
     * @prop {string} activeCategory
     * @prop {string} pattern
     */
    /** @type {CategorySelectionProps } */
    let { activeCategory = $bindable(), pattern = $bindable() } = $props();
</script>

{#each Object.entries(NodeDefs) as [category, def] (category)}
    <Button
        tooltipSide="top"
        variant="ghost"
        size="icon"
        class={[
            "w-20 h-14 flex-col gap-1",
            activeCategory === category ? "bg-primary/20 text-primary" : "",
        ]}
        onclick={() => {
            activeCategory = activeCategory === category ? null : category;
            pattern = "";
        }}
    >
        {#snippet tooltip()}
            <span class="text-xs font-normal">
                {def.label}
            </span>
        {/snippet}
        <def.icon class="h-5 w-5" />
    </Button>
{/each}
