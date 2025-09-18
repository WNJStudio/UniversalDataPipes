<script module>
    import { v4 } from "uuid";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { NodeData } from "./Node.svelte";
    import { Position } from "./Position.svelte";
    import { CircleQuestionMark } from "@lucide/svelte";
    import { HandleData } from "./Handle.svelte";
    import { Size } from "./Size.svelte";

    export class NodeDefinition {
        /**
         * @param {string} category
         * @param {string} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Snippet<[{inputs:HandleData[], outputs:HandleData[]}]>} render
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        constructor(category, name, inputs, outputs, render, icon) {
            this.category = category;
            this.name = name;
            this.inputs = inputs;
            this.outputs = outputs;
            this.render = render;
            this.icon = icon;
        }

        create(x, y) {
            const nodeId = v4();
            return new NodeData(
                nodeId,
                this.category,
                this.name,
                new Position(x, y),
                new Size(),
                new Size(),
                this.inputs.map((i) => i.create(nodeId)),
                this.outputs.map((o) => o.create(nodeId)),
            );
        }
    }

    export const DefaultNodeDef = new NodeDefinition(
        "default",
        "default",
        [],
        [],
        defaultNode,
        CircleQuestionMark,
    );
</script>

{#snippet defaultNode({ inputs, outputs })}
    <p class="text-muted-foreground text-2xl font-body">Default</p>
{/snippet}
