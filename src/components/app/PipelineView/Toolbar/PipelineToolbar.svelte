<script>
  import {
    Hand,
    MousePointer,
    Search,
    Trash2,
    ZoomIn,
    ZoomOut,
  } from "@lucide/svelte";
  import { NodeDefs } from "../../../../model/Node.svelte";
  import Button from "../../../ui/Button/Button.svelte";
  import Card from "../../../ui/Card/Card.svelte";
  import Tooltip from "../../../ui/Tooltip/Tooltip.svelte";
  import FlyOut from "../../../ui/Transitions/FlyOut.svelte";
  import Input from "../../../ui/Input/Input.svelte";
  import { fade, scale, slide } from "svelte/transition";
  import { linear } from "svelte/easing";
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
  /** @type {keyof NodeDefs|""} */
  let activeCategory = $state("");

  let pattern = $state("");
  let query = $derived(new RegExp(pattern, "i"));

  let filteredNodes = $derived(
    NodeDefs[activeCategory]?.nodes?.filter?.((n) => query.test(n.name)) || [],
  );

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
  <FlyOut hidden={activeCategory === "" || !activeCategory} y="100%">
    <Card class="bg-card/90 backdrop-blur-xs w-full max-w-[50vw]">
      <div class="p-2">
        <div class="flex items-center gap-2 my-2 px-2">
          <Search class="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search nodes..."
            class="h-8 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={pattern}
            onValueChange={(v) => (pattern = v)}
          />
        </div>
        <div class="overflow-x-auto custom-scrollbar">
          <div
            class={[
              "flex items-center gap-2 pb-2",
              filteredNodes.length > 0 ? "w-max" : "",
            ]}
          >
            {#if filteredNodes.length === 0}
              <p class="text-sm text-muted-foreground text-center w-full py-4">
                No nodes found.
              </p>
            {/if}
            {#each filteredNodes as node (node.name)}
              <div transition:fade>
                <Tooltip>
                  {#snippet content()}
                    <p>{node.name}</p>
                  {/snippet}
                  {#snippet trigger({ attach })}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      {@attach attach}
                      data-template-category={activeCategory}
                      data-template-name={node.name}
                      onmousedown={spawnNode}
                      class="flex flex-col items-center justify-center p-2 rounded-md cursor-grab hover:bg-accent hover:text-accent-foreground w-24 h-20 border border-transparent hover:border-primary transition-colors"
                    >
                      <node.icon class="h-6 w-6 mb-1 text-primary" />
                    </div>
                  {/snippet}
                </Tooltip>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Card>
  </FlyOut>
  <Card class="bg-card/90 backdrop-blur-xs">
    <div class="p-2">
      <div class="flex items-center divide-x divide-border">
        <div class="flex items-center gap-2 pr-2">
          {#each Object.entries(NodeDefs) as [category, def] (category)}
            <Button
              tooltipSide="top"
              variant="ghost"
              size="icon"
              class={[
                "w-20 h-14 flex-col gap-1",
                activeCategory === category ? "bg-primary/20 text-primary" : "",
              ]}
              onclick={() => {
                activeCategory = activeCategory === category ? null : category;
                pattern = "";
              }}
            >
              {#snippet tooltip()}
                <span class="text-xs font-normal">
                  {def.label}
                </span>
              {/snippet}
              <def.icon class="h-5 w-5" />
            </Button>
          {/each}
        </div>
        <div class="flex items-center gap-1 px-2">
          <Button
            tooltipSide="top"
            variant="ghost"
            size="icon"
            onclick={() => (panMode = !panMode)}
          >
            {#snippet tooltip()}
              <p class="text-xs">
                {panMode ? "Pan Mode (P)" : "Select Mode (V)"}
              </p>
            {/snippet}
            {#if panMode}
              <Hand class="h-5 w-5" />
            {:else}
              <MousePointer class="h-5 w-5" />
            {/if}
          </Button>
          <Button
            tooltipSide="top"
            variant="ghost"
            size="icon"
            onclick={onZoomIn}
          >
            {#snippet tooltip()}
              <p class="text-xs">Zoom In (CTRL + Scroll Up)</p>
            {/snippet}
            <ZoomIn class="h-5 w-5" />
          </Button>
          <p
            class="select-none text-xs text-muted-foreground min-w-10 text-center"
          >
            {(currentZoom * 100).toFixed(0)}%
          </p>
          <Button
            tooltipSide="top"
            variant="ghost"
            size="icon"
            onclick={onZoomOut}
          >
            {#snippet tooltip()}
              <p class="text-xs">Zoom Out (CRTL + Scroll Down)</p>
            {/snippet}
            <ZoomOut class="h-5 w-5" />
          </Button>
        </div>
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
      </div>
    </div>
  </Card>
</FlyOut>
