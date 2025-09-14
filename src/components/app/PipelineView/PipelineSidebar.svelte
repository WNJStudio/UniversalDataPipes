<script>
  import {
    Download,
    SquareArrowOutUpRight as Load,
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

  /**
   * @typedef {Object} PipelineSidebarProps
   * @prop {boolean} hidden
   * @prop {Pipeline[]} savedPipelines
   * @prop {(s?:string)=>any} onSave
   * @prop {(name:string)=>any} onDelete
   * @prop {(p:Pipeline)=>any} onLoad
   */
  /** @type {PipelineSidebarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { hidden, savedPipelines, onSave, onLoad, onDelete, ...props } = $props();

  let deleteDialogOpen = $state(false);
  let deleteCandidateName = $state();

  const closeDialog = () => {
    deleteCandidateName = undefined;
    deleteDialogOpen = false;
  };

  const openDeleteDialog = (deleting) => {
    deleteDialogOpen = true;
    deleteCandidateName = deleting;
  };

  const handleDelete = () => {
    onDelete(deleteCandidateName);
    closeDialog();
  };
</script>

<!-- TODO -->

<FlyOut
  {hidden}
  x="-100%"
  class={["w-64 border-r border-border/50 flex flex-col h-full", props.class]}
>
  <div class="p-4 border-b border-border/50">
    <h2 class="text-lg font-semibold select-none">Pipelines</h2>
    <p class="text-sm text-muted-foreground select-none">
      Save and load your pipeline configurations.
    </p>
  </div>
  <div class="p-4">
    <Card class="overflow-hidden group">
      <Button onclick={() => onSave()} class="w-full rounded-none select-none">
        <Save class="mr-2 h-4 w-4" />
        Save Current Pipeline
      </Button>
      <div class="flex bg-muted/50 border-t">
        <Button
          tooltipSide="bottom"
          variant="ghost"
          size="sm"
          class="flex-1 rounded-none"
        >
          {#snippet tooltip()}
            {"Export JSON"}
          {/snippet}
          <!-- TODO: add onclick -->
          <Download class="h-4 w-4" />
        </Button>
        <Button
          tooltipSide="bottom"
          variant="ghost"
          size="sm"
          class="flex-1 rounded-none"
        >
          {#snippet tooltip()}
            {"Import JSON"}
          {/snippet}
          <!-- TODO: add onclick -->
          <Upload class="h-4 w-4" />
        </Button>
      </div>
    </Card>
  </div>
  <!-- TODO: Add a searchbox/filter -->
  <ScrollArea class="flex-1 min-h-0">
    <div class="p-4 space-y-4">
      {#each savedPipelines as pipeline (pipeline.name)}
        <div transition:slide={{ axis: "y" }}>
          <Card data-key={pipeline.name} class="overflow-hidden group">
            <div class="p-3">
              <CardTitle class="text-base">{pipeline.name}</CardTitle>
              <CardDescription class="text-xs mt-1">
                Saved on {pipeline.saveLocalString}
              </CardDescription>
            </div>
            <div class="flex bg-muted/50 border-t">
              <Button
                tooltipSide="bottom"
                variant="ghost"
                size="sm"
                class="flex-1 rounded-none text-primary hover:text-primary"
                onclick={() => onSave(pipeline.name)}
              >
                {#snippet tooltip()}
                  {"Overwrite"}
                {/snippet}
                <Save class="h-4 w-4" />
              </Button>

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
              <Button
                tooltipSide="bottom"
                variant="ghost"
                size="sm"
                class="flex-1 rounded-none text-destructive hover:bg-destructive/30 hover:text-destructive"
                onclick={() => openDeleteDialog(pipeline.name)}
              >
                {#snippet tooltip()}
                  {"Delete Pipeline"}
                {/snippet}
                <Trash2 class="h-4 w-4" />
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
        <span class="font-semibold"> {deleteCandidateName}</span>.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <AlertDialogCancel onclick={closeDialog}>Cancel</AlertDialogCancel>
      <Button onclick={handleDelete}>Continue</Button>
    </DialogFooter>
  {/snippet}
</Dialog>
