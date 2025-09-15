<script>
    import { Download, EllipsisVertical, Upload } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import DropdownMenu from "../../../ui/DropdownMenu/DropdownMenu.svelte";
    import DropdownMenuItem from "../../../ui/DropdownMenu/DropdownMenuItem.svelte";

    /**
     * @typedef {Object} SidebarMenuProps
     * @prop {()=>any} onExportAll
     * @prop {()=>any} onImportAll
     */
    /** @type {SidebarMenuProps} */
    let { onExportAll, onImportAll } = $props();
</script>

<DropdownMenu name="pipelines_more">
    {#snippet trigger({ attach })}
        <Button {attach} variant="ghost" size="icon">
            <EllipsisVertical class="h-4 w-4" />
        </Button>
    {/snippet}
    {#snippet content()}
        <DropdownMenuItem onClick={onExportAll}>
            <Download class="mr-2 h-4 w-4" />
            <span>Export All Pipelines</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportAll}>
            <Upload class="mr-2 h-4 w-4" />
            <span>Import Pipelines</span>
        </DropdownMenuItem>
    {/snippet}
</DropdownMenu>
