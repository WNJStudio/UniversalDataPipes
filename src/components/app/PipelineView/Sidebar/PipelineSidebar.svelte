<script>
  import { Save } from "@lucide/svelte";
  import { fly } from "svelte/transition";
  import { pipelineContext } from "../../../../context/PipelineContext.svelte";
  import {
    getCurrentView,
    getSidebarStatus,
    getSidebarToggler,
    PIPEVIEW,
  } from "../../../../context/SettingsContext.svelte";
  import { t } from "../../../../i18n/i18n.svelte";
  import { Pipeline, pipelineStorage } from "../../../../model/Pipeline.svelte";
  import { getMenuDisplayer } from "../../../../portals/MenuPortal.svelte";
  import Button from "../../../ui/Button/Button.svelte";
  import ScrollArea from "../../../ui/ScrollArea/ScrollArea.svelte";
  import DeleteDialog from "./DeleteDialog.svelte";
  import NoPipelines from "./NoPipelines.svelte";
  import PipelineCard from "./PipelineCard.svelte";
  import PipelineMenu from "./PipelineMenu.svelte";
  import SearchBar from "./SearchBar.svelte";
  import SidebarMenu from "./SidebarMenu.svelte";

  /**
   * @typedef {Object} PipelineSidebarProps
   * @prop {(s?:string)=>any} onSave
   * @prop {()=>any} onExportAll
   * @prop {()=>any} onImportAll
   * @prop {(name:string)=>any} onExportSingle
   */
  /** @type {PipelineSidebarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { onSave, onExportAll, onImportAll, onExportSingle, ...props } = $props();

  const portalShow = getMenuDisplayer();
  const currentView = getCurrentView();
  const sidebarStatus = getSidebarStatus();
  const sidebarToggler = getSidebarToggler();
  const pipeline = pipelineContext.get();

  let hidden = $derived(!sidebarStatus() || currentView() !== PIPEVIEW);

  let deleteDialogOpen = $state(false);
  let actionCandidateName = $state();

  let pattern = $state("");
  let query = $derived(new RegExp(pattern, "i"));

  let filteredPipelines = $derived(
    Pipeline.load().filter((p) => query.test(p.name)),
  );

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
    pipelineStorage.current[actionCandidateName] = undefined;
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

  /**
   * @param {Pipeline} pipe
   */
  const onLoad = (pipe) => {
    pipeline.shipOfTheseus(pipe);
  };

  /**
   * @param {KeyboardEvent} e
   */
  const onkeydown = (e) => {
    if (e.ctrlKey && e.key?.toLowerCase() === "b") {
      sidebarToggler();
    }
  };
</script>

{#if !hidden}
  <div
    transition:fly={{ x: "-100%" }}
    role="button"
    tabindex="0"
    oncontextmenu={onContextMenu}
    class={[
      "absolute z-50 bg-sidebar/75 w-64 border-r border-border/50 flex flex-col h-full",
      props.class,
    ]}
  >
    <div
      class="p-4 border-b border-border/50 flex justify-between items-center"
    >
      <div>
        <h2 class="text-lg font-semibold select-none">
          {t("label.pipeline.plural")}
        </h2>
        <p class="text-sm text-muted-foreground select-none">
          {t("label.sidebar.description")}
        </p>
      </div>
      <SidebarMenu {onExportAll} {onImportAll} />
    </div>
    <div class="p-4">
      <Button onclick={() => onSave()} class="w-full select-none">
        <Save class="mr-2 h-4 w-4" />
        {t("label.sidebar.savecurrent")}
      </Button>
    </div>
    <SearchBar bind:pattern />
    <ScrollArea class="flex-1 min-h-0">
      <div class="p-4 space-y-4">
        {#each filteredPipelines as pipeline (pipeline.name)}
          <PipelineCard {pipeline} {handlePipelineMore} {onLoad} />
        {/each}
        <NoPipelines {filteredPipelines} {onSave} {pattern} />
      </div>
    </ScrollArea>
  </div>
{/if}
<DeleteDialog
  {actionCandidateName}
  {closeDialog}
  {deleteDialogOpen}
  {handleDelete}
/>
<PipelineMenu {handleExportSingle} {openDeleteDialog} />

<svelte:window {onkeydown} />
