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
   * @prop {boolean} hidden
   * @prop {number} currentZoom
   * @prop {()=>any} onZoomIn
   * @prop {()=>any} onZoomOut
   * @prop {(e)=>any} onToolbarDrag
   */

  /** @type {PipelineToolbarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { hidden, currentZoom, onZoomIn, onZoomOut, onToolbarDrag, ...props } =
    $props();

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
          <CursorToggle />
          <ZoomInButton {onZoomIn} />
          <ZoomIndicator {currentZoom} />
          <ZoomOutButton {onZoomOut} />
        </div>
        <DeleteSection />
      </div>
    </div>
  </Card>
</FlyOut>
