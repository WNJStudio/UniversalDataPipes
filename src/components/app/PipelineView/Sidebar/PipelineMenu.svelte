<script>
    import { t } from "@i18n/i18n.svelte";
    import { Download, Trash2 } from "@lucide/svelte";
    import DropdownMenu from "@ui/DropdownMenu/DropdownMenu.svelte";
    import DropdownMenuItem from "@ui/DropdownMenu/DropdownMenuItem.svelte";

    /**
     * @typedef {Object} PipelineMenuProps
     * @prop {(e:MouseEvent)=>any} handleExportSingle
     * @prop {(e:MouseEvent)=>any} openDeleteDialog
     */
    /** @type {PipelineMenuProps } */
    let { handleExportSingle, openDeleteDialog } = $props();
</script>

<DropdownMenu name="pipeline_more">
    {#snippet content()}
        <DropdownMenuItem onClick={handleExportSingle}>
            <Download class="mr-2 h-4 w-4" />
            <span>{t("label.export")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
            onClick={openDeleteDialog}
            class="text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
            <Trash2 class="mr-2 h-4 w-4" />
            <span>{t("label.delete")}</span>
        </DropdownMenuItem>
    {/snippet}
</DropdownMenu>
