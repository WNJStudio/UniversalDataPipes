<script>
  import { bounceIn, cubicOut, elasticOut } from "svelte/easing";
  import { NodeData } from "../../../../model/Node.svelte";
  import { getDefinition } from "../../../../model/NodeCategory.svelte";
  import Card from "../../../ui/Card/Card.svelte";
  import CardHeader from "../../../ui/Card/CardHeader.svelte";
  import CardTitle from "../../../ui/Card/CardTitle.svelte";
  import Handle from "./Handle.svelte";

  /**
   * @typedef {Object} BaseNodeProps
   * @prop {boolean} isSelected
   * @prop {boolean} isDragging
   * @prop {(e:MouseEvent, id:string)=>any} onClick
   * @prop {NodeData} node
   */
  /** @type {BaseNodeProps & import('svelte/elements').SvelteHTMLElements['div']} */
  let { isSelected, isDragging, node, onClick, ...props } = $props();
  let definition = $derived(getDefinition(node.category, node.name));

  const Icon = $derived(definition ? definition.icon : undefined);

  /**
   * @param {HTMLElement} node
   * @param {{delay?:number, duration?:number}} args
   * @returns {import('svelte/transition').TransitionConfig}
   */
  const plop = (node, { delay = 150, duration = 800 }) => {
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
   * @param {HTMLElement} node
   * @param {{delay?:number, duration?:number}} args
   * @returns {import('svelte/transition').TransitionConfig}
   */
  const puff = (node, { delay = 300, duration = 300 }) => {
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
  in:plop={{}}
  out:puff={{}}
  role="definition"
  data-node-id={node.id}
  id={node.id}
  onclick={(e) => onClick(e, node.id)}
  class={["absolute min-w-3xs", isDragging ? "opacity-50" : "", props.class]}
  style={`left: ${node.position.x}px; top: ${node.position.y}px;`}
>
  <Card
    class={[
      "shadow-2xl! shadow-black/50 transition-[filter] flex",
      "[&:not(:has(.handle:hover))]:hover:brightness-150",
      isSelected
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
            {node.name}
          </CardTitle>
        </div>
      </CardHeader>
      <div
        data-node-content="true"
        class="bg-card-foreground/5 flex-1 flex flex-col items-center justify-between relative"
      >
        <div class="p-3 flex-1 w-full rounded-lg bg-secondary">
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
</div>
