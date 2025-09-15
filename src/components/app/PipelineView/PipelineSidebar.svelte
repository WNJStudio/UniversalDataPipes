<script>
  import {
    Download,
    SquareArrowOutUpRight as Load,
    EllipsisVertical,
    Plus,
    Save,
    Trash2,
    Upload,
  } from "@lucide/svelte";
  import { slide } from "svelte/transition";
  import { Pipeline } from "../../../model/Pipeline.svelte";
  import Button from "../../ui/Button/Button.svelte";
  import Card from "../../ui/Card/Card.svelte";
  import CardDescription from "../../ui/Card/CardDescription.svelte";
  import CardTitle from "../../ui/Card/CardTitle.svelte";
  import ScrollArea from "../../ui/ScrollArea/ScrollArea.svelte";
  import FlyOut from "../../ui/Transitions/FlyOut.svelte";
  import SlideOut from "../../ui/Transitions/SlideOut.svelte";
  import Dialog from "../../ui/Dialog/Dialog.svelte";
  import DialogHeader from "../../ui/Dialog/DialogHeader.svelte";
  import DialogFooter from "../../ui/Dialog/DialogFooter.svelte";
  import DialogTitle from "../../ui/Dialog/DialogTitle.svelte";
  import DialogDescription from "../../ui/Dialog/DialogDescription.svelte";
  import AlertDialogCancel from "../../ui/Dialog/AlertDialogCancel.svelte";
  import DropdownMenu from "../../ui/DropdownMenu/DropdownMenu.svelte";
  import DropdownMenuItem from "../../ui/DropdownMenu/DropdownMenuItem.svelte";
  import { getContext } from "svelte";
  import Tooltip from "../../ui/Tooltip/Tooltip.svelte";

  /**
   * @typedef {Object} PipelineSidebarProps
   * @prop {boolean} hidden
   * @prop {Pipeline[]} savedPipelines
   * @prop {(s?:string)=>any} onSave
   * @prop {(name:string)=>any} onDelete
   * @prop {(p:Pipeline)=>any} onLoad
   * @prop {()=>any} onExportAll
   * @prop {()=>any} onImportAll
   * @prop {(name:string)=>any} onExportSingle
   */
  /** @type {PipelineSidebarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let {
    hidden,
    savedPipelines,
    onSave,
    onLoad,
    onDelete,
    onExportAll,
    onImportAll,
    onExportSingle,
    ...props
  } = $props();

  /**
   * @type {(name:string, x?:number, y?:number)=>any}
   */
  const portalShow = getContext("menu_display");

  let deleteDialogOpen = $state(false);
  let actionCandidateName = $state();

  const closeDialog = () => {
    actionCandidateName = undefined;
    deleteDialogOpen = false;
  };

  /**
   * @param {MouseEvent} e
   */
  const openDeleteDialog = (e) => {
    if (actionCandidateName) {
      deleteDialogOpen = true;
    }
  };

  const handleDelete = () => {
    onDelete(actionCandidateName);
    closeDialog();
  };

  /**
   * @param {MouseEvent} e
   */
  const handlePipelineMore = (e) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.closest("[data-key]")) {
        const targetPipelineEl = e.target.closest("[data-key]");
        const pipeName = targetPipelineEl.getAttribute("data-key");
        if (pipeName) {
          actionCandidateName = pipeName;
          portalShow("pipeline_more", e.clientX, e.clientY);
        }
      }
    }
  };

  /**
   * @param {MouseEvent} e
   */
  const handleExportSingle = (e) => {
    if (actionCandidateName) {
      onExportSingle(actionCandidateName);
      actionCandidateName = undefined;
    }
  };

  /**
   * @param {MouseEvent} e
   */
  const onContextMenu = (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      if (e.target.closest("[data-key]")) {
        const targetPipelineEl = e.target.closest("[data-key]");
        const pipeName = targetPipelineEl.getAttribute("data-key");
        if (pipeName) {
          actionCandidateName = pipeName;
          portalShow("pipeline_more", e.clientX, e.clientY);
        }
        return;
      }
      portalShow("pipelines_more", e.clientX, e.clientY);
    }
  };
</script>

<!-- TODO -->

<FlyOut
  oncontextmenu={onContextMenu}
  {hidden}
  x="-100%"
  class={["w-64 border-r border-border/50 flex flex-col h-full", props.class]}
>
  <div class="p-4 border-b border-border/50 flex justify-between items-center">
    <div>
      <h2 class="text-lg font-semibold select-none">Pipelines</h2>
      <p class="text-sm text-muted-foreground select-none">
        Save and load your pipeline configurations.
      </p>
    </div>
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
  </div>
  <div class="p-4">
    <Button onclick={() => onSave()} class="w-full select-none">
      <Save class="mr-2 h-4 w-4" />
      Save Current Pipeline
    </Button>
  </div>
  <!-- TODO: Add a searchbox/filter -->
  <ScrollArea class="flex-1 min-h-0">
    <div class="p-4 space-y-4">
      {#each savedPipelines as pipeline (pipeline.name)}
        <div transition:slide={{ axis: "y" }}>
          <Card data-key={pipeline.name} class="overflow-hidden group">
            <div class="p-3 flex justify-between items-start">
              <div class="overflow-hidden">
                <Tooltip delay={800} preferredSide="top">
                  {#snippet content()}
                    {pipeline.name}
                  {/snippet}
                  {#snippet trigger({ attach })}
                    <CardTitle
                      {attach}
                      class="text-base overflow-ellipsis overflow-hidden"
                      >{pipeline.name}</CardTitle
                    >
                  {/snippet}
                </Tooltip>
                <CardDescription class="text-xs mt-1">
                  Saved on {pipeline.saveLocalString}
                </CardDescription>
              </div>
              <Button
                onclick={handlePipelineMore}
                variant="ghost"
                size="icon"
                class="h-8 w-8 -mr-2 -mt-1"
              >
                <EllipsisVertical class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex bg-muted/50 border-t">
              <Button
                tooltipSide="bottom"
                variant="ghost"
                size="sm"
                class="flex-1 rounded-none"
                onclick={() => onLoad(pipeline)}
              >
                {#snippet tooltip()}
                  {"Load Pipeline"}
                {/snippet}
                <Load class="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      {/each}
      <SlideOut
        hidden={savedPipelines.length > 0}
        axis="y"
        class="text-center text-sm text-muted-foreground py-10"
      >
        <p class="select-none">No saved pipelines yet.</p>
        <Button
          variant="outline"
          size="sm"
          class="mt-4 select-none"
          onclick={() => onSave()}
        >
          <Plus class="mr-2 h-4 w-4" />
          Save your first pipeline
        </Button>
      </SlideOut>
    </div>
  </ScrollArea>
</FlyOut>
<Dialog
  isAlert
  bind:isOpen={deleteDialogOpen}
  onClose={closeDialog}
  onCancel={closeDialog}
>
  {#snippet content()}
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete the pipeline
        file
        <span class="font-semibold"> {actionCandidateName}</span>.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <AlertDialogCancel onclick={closeDialog}>Cancel</AlertDialogCancel>
      <Button onclick={handleDelete}>Continue</Button>
    </DialogFooter>
  {/snippet}
</Dialog>
<DropdownMenu name="pipeline_more">
  {#snippet content()}
    <DropdownMenuItem onClick={handleExportSingle}>
      <Download class="mr-2 h-4 w-4" />
      <span>Export</span>
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={openDeleteDialog}
      class="text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 class="mr-2 h-4 w-4" />
      <span>Delete</span>
    </DropdownMenuItem>
  {/snippet}
</DropdownMenu>
