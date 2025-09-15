<script>
  import Card from "../../../ui/Card/Card.svelte";
  import FlyOut from "../../../ui/Transitions/FlyOut.svelte";
  import CategorySelection from "./CategorySelection.svelte";
  import CursorToggle from "./CursorToggle.svelte";
  import DeleteSection from "./DeleteSection.svelte";
  import NodeSelection from "./NodeSelection.svelte";
  import ZoomInButton from "./ZoomInButton.svelte";
  import ZoomIndicator from "./ZoomIndicator.svelte";
  import ZoomOutButton from "./ZoomOutButton.svelte";
  /**
   * @typedef {Object} PipelineToolbarProps
   * @prop {boolean} panMode
   * @prop {boolean} hidden
   * @prop {boolean} hasSelection
   * @prop {number} currentZoom
   * @prop {()=>any} onZoomIn
   * @prop {()=>any} onZoomOut
   * @prop {()=>any} onDelete
   * @prop {(e)=>any} onToolbarDrag
   */

  /** @type {PipelineToolbarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let {
    panMode = $bindable(),
    hidden,
    hasSelection,
    currentZoom,
    onZoomIn,
    onZoomOut,
    onDelete,
    onToolbarDrag,
    ...props
  } = $props();
  /** @type {string} */
  let activeCategory = $state("");
  let pattern = $state("");

  const spawnNode = (e) => {
    activeCategory = "";
    onToolbarDrag(e);
  };
</script>

<FlyOut
  {hidden}
  y="100%"
  class={[
    "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2",
    props.class,
  ]}
>
  <NodeSelection {spawnNode} {activeCategory} bind:pattern />
  <Card class="bg-card/90 backdrop-blur-xs">
    <div class="p-2">
      <div class="flex items-center divide-x divide-border">
        <div class="flex items-center gap-2 pr-2">
          <CategorySelection bind:pattern bind:activeCategory />
        </div>
        <div class="flex items-center gap-1 px-2">
          <CursorToggle bind:panMode />
          <ZoomInButton {onZoomIn} />
          <ZoomIndicator {currentZoom} />
          <ZoomOutButton {onZoomOut} />
        </div>
        <DeleteSection {onDelete} {hasSelection} />
      </div>
    </div>
  </Card>
</FlyOut>
