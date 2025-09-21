<script>
    import { Trash2 } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import {
        getHasSelection,
        getNodeSelectionChecker,
        getSelectedNodes,
        getSelectionCleaner,
    } from "../CanvasActions/Select.svelte";
    import { pipelineContext } from "../../../../context/PipelineContext.svelte";
    import { dataContext } from "../../../../context/DataContext.svelte";
    import { onDelete } from "../CanvasActions/Delete.svelte";

    const hasSelection = getHasSelection();
    const selectedNodes = getSelectedNodes();
    const pipeline = pipelineContext.get();
    const data = dataContext.get();
    const checker = getNodeSelectionChecker();
    const cleaner = getSelectionCleaner();
</script>

<div class="pl-2">
    <Button
        tooltipSide="top"
        variant="ghost"
        size="icon"
        onclick={() =>
            onDelete(selectedNodes, pipeline, data, checker, cleaner)}
        disabled={!hasSelection()}
    >
        {#snippet tooltip()}
            <p class="text-xs">Delete Selected</p>
        {/snippet}
        <Trash2 class="h-5 w-5 text-destructive" />
    </Button>
</div>
