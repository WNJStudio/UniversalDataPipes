<script>
    import { Trash2 } from "@lucide/svelte";
    import { dataContext } from "../../../../context/DataContext.svelte";
    import { pipelineContext } from "../../../../context/PipelineContext.svelte";
    import { t } from "../../../../i18n/i18n.svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import { onDelete } from "../CanvasActions/Delete.svelte";
    import {
        getHasSelection,
        getNodeSelectionChecker,
        getSelectedEdges,
        getSelectedNodes,
        getSelectionCleaner,
    } from "../CanvasActions/Select.svelte";

    const hasSelection = getHasSelection();
    const selectedNodes = getSelectedNodes();
    const selectedEdges = getSelectedEdges();
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
            onDelete(
                selectedNodes,
                selectedEdges,
                pipeline,
                data,
                checker,
                cleaner,
            )}
        disabled={!hasSelection()}
    >
        {#snippet tooltip()}
            <p class="text-xs">{t("label.toolbar.delete.tooltip")}</p>
        {/snippet}
        <Trash2 class="h-5 w-5 text-destructive" />
    </Button>
</div>
