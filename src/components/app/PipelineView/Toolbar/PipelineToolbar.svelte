<script>
  import Card from "@ui/Card/Card.svelte";
  import { fly } from "svelte/transition";
  import CursorToggle from "./CursorToggle.svelte";
  import DeleteSection from "./DeleteSection.svelte";
  import ZoomInButton from "./ZoomInButton.svelte";
  import ZoomIndicator from "./ZoomIndicator.svelte";
  import ZoomOutButton from "./ZoomOutButton.svelte";
  /**
   * @typedef {Object} PipelineToolbarProps
   * @prop {boolean} hidden
   * @prop {number} currentZoom
   * @prop {()=>any} onZoomIn
   * @prop {()=>any} onZoomOut
   */

  /** @type {PipelineToolbarProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { hidden, currentZoom, onZoomIn, onZoomOut, ...props } = $props();
</script>

{#if !hidden}
  <div
    transition:fly={{ y: "100%" }}
    class={[
      "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2",
      props.class,
    ]}
  >
    <Card class="bg-card/90 backdrop-blur-xs">
      <div class="p-2">
        <div class="flex items-center divide-x divide-border">
          <CursorToggle />
          <!-- TODO: Copy Cut Paste -->
          <div class="flex items-center gap-1 px-2">
            <ZoomInButton {onZoomIn} />
            <ZoomIndicator {currentZoom} />
            <ZoomOutButton {onZoomOut} />
          </div>
          <DeleteSection />
        </div>
      </div>
    </Card>
  </div>
{/if}
