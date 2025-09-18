<script>
    import { Plus } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import SlideOut from "../../../ui/Transitions/SlideOut.svelte";
    import {
        Pipeline,
        pipelineStorage,
    } from "../../../../model/Pipeline.svelte";

    /**
     * @typedef {Object} NoPipelinesProps
     * @prop {string} pattern
     * @prop {Pipeline[]} filteredPipelines
     * @prop {()=>any} onSave
     */
    /** @type {NoPipelinesProps} */
    let { filteredPipelines, pattern, onSave } = $props();
</script>

<SlideOut
    hidden={filteredPipelines.length > 0}
    axis="y"
    class="text-center text-sm text-muted-foreground py-10"
>
    <p class="select-none">No saved pipelines found.</p>
    {#if Object.keys(pipelineStorage.current).length > 0 && pattern !== ""}
        <p class="mt-2">Try searching for something else.</p>
    {/if}
    {#if Object.keys(pipelineStorage.current).length === 0}
        <Button
            variant="outline"
            size="sm"
            class="mt-4 select-none"
            onclick={() => onSave()}
        >
            <Plus class="mr-2 h-4 w-4" />
            Save your first pipeline
        </Button>
    {/if}
</SlideOut>
