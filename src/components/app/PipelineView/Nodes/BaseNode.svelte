<script>
  import { cubicOut, elasticOut } from "svelte/easing";
  import {
    getGridSize,
    getSnapToGrid,
  } from "../../../../context/SettingsContext.svelte";
  import { t } from "../../../../i18n/i18n.svelte";
  import { NodeData } from "../../../../model/Node.svelte";
  import { getDefinition } from "../../../../model/NodeCategory.svelte";
  import { roundMult } from "../../../../utils/MathUtils";
  import Card from "../../../ui/Card/Card.svelte";
  import CardHeader from "../../../ui/Card/CardHeader.svelte";
  import CardTitle from "../../../ui/Card/CardTitle.svelte";
  import { getIsDragging } from "../CanvasActions/Drag.svelte";
  import { getIsPanning } from "../CanvasActions/Pan.svelte";
  import {
    getNodeSelectionChecker,
    onNodeClick,
  } from "../CanvasActions/Select.svelte";
  import Handle from "./Handle.svelte";

  /**
   * @typedef {Object} BaseNodeProps
   * @prop {NodeData} node
   */
  /** @type {BaseNodeProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { node, ...props } = $props();
  const checker = getNodeSelectionChecker();
  const isSelected = () => checker([node.id]);
  const isDragging = getIsDragging();
  const isPanning = getIsPanning();
  const gridSize = getGridSize();
  const isSnapToGrid = getSnapToGrid();
  let definition = $derived(getDefinition(node.category, node.name));

  const Icon = $derived(definition ? definition.icon : undefined);

  let width = $derived(node.size?.width);
  let minWidth = $derived(node.minSize?.width);
  let height = $derived(node.size?.height);

  let ref = $state();

  /**
   * @param {HTMLElement} _el
   * @param {{delay?:number, duration?:number}} args
   * @returns {import('svelte/transition').TransitionConfig}
   */
  const plop = (_el, { delay = 150, duration = 800 }) => {
    return {
      delay,
      duration,
      css: (t, u) => {
        const v = elasticOut(t);
        return `transform-origin: top; transform: scaleY(${v});`;
      },
    };
  };

  /**
   * @param {HTMLElement} _el
   * @param {{delay?:number, duration?:number}} args
   * @returns {import('svelte/transition').TransitionConfig}
   */
  const puff = (_el, { delay = 300, duration = 300 }) => {
    return {
      delay,
      duration,
      css: (t, u) => {
        const v = cubicOut(t);
        return `transform: scale(${v});`;
      },
    };
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={ref}
  in:plop={{}}
  out:puff={{}}
  role="definition"
  data-node-id={node.id}
  id={node.id}
  onclick={(e) => onNodeClick(e, node.id)}
  class={[
    "absolute",
    isDragging() && isSelected() ? "opacity-50" : "",
    props.class,
  ]}
  style={`left: ${node.position?.x}px;
          top: ${node.position?.y}px;
          ${width ? ` width: ${width}px;` : ""}
          ${height ? ` height: ${height}px;` : ""}
          min-width: ${minWidth ? (isSnapToGrid() ? roundMult(minWidth, gridSize()) : minWidth) : "200"}px;`}
>
  <Card
    class={[
      "shadow-2xl! shadow-black/50 transition-[filter] flex h-full",
      isPanning()
        ? ""
        : "[&:not(:has([data-handle-id]:hover)):not(:has([data-resize-handle]:hover))]:hover:brightness-150",
      isSelected()
        ? "ring-2 ring-primary ring-offset-2 ring-offset-background brightness-125"
        : "",
    ]}
  >
    <div
      class="flex flex-col gap-2 w-2 bg-card-foreground/5 py-3 justify-center"
    >
      {#each node.inputs as input (input.id)}
        <Handle handle={input} />
      {/each}
    </div>
    <div class="flex-1 flex flex-col">
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 p-3 bg-card-foreground/5 relative"
      >
        <div class="flex items-center gap-2">
          <Icon class="h-4 w-4 text-primary" />
          <CardTitle class="text-sm font-medium">
            {t(node.name)}
          </CardTitle>
        </div>
      </CardHeader>
      <div
        data-node-content="true"
        class="bg-card-foreground/5 flex-1 flex flex-col items-center justify-between relative"
      >
        <div class="p-3 flex-1 flex flex-col w-full rounded-lg bg-secondary">
          {@render definition?.render?.({
            inputs: node.inputs,
            outputs: node.outputs,
          })}
        </div>
      </div>
      <div class="bg-card-foreground/5 h-2"></div>
    </div>
    <div
      class="flex flex-col gap-2 w-2 bg-card-foreground/5 py-3 justify-center"
    >
      {#each node.outputs as output (output.id)}
        <Handle handle={output} />
      {/each}
    </div>
  </Card>
  <div
    data-resize-handle="true"
    class={[
      "absolute h-3 w-3 bottom-0 right-0 group",
      isPanning() ? "" : "cursor-nwse-resize",
    ]}
  >
    <div
      class={[
        "absolute bottom-0 right-0 w-3 h-3 rounded-tl-lg rounded-br-lg transition-colors bg-accent/25",
        isPanning()
          ? ""
          : "group-hover:bg-primary/75 group-hover:brightness-150",
      ]}
    ></div>
  </div>
</div>
