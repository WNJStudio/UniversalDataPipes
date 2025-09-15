<script>
    import { Trash2 } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";

    /**
     * @typedef {Object} DeleteButtonProps
     * @prop {boolean} hasSelection
     * @prop {()=>any} onDelete
     */
    /** @type {DeleteButtonProps} */
    let { onDelete, hasSelection } = $props();
</script>

<div class="pl-2">
    <Button
        tooltipSide="top"
        variant="ghost"
        size="icon"
        onclick={onDelete}
        disabled={!hasSelection}
    >
        {#snippet tooltip()}
            <p class="text-xs">Delete Selected</p>
        {/snippet}
        <Trash2 class="h-5 w-5 text-destructive" />
    </Button>
</div>
