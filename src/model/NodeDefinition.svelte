<script module>
    import { CircleQuestionMark } from "@lucide/svelte";
    import { v4 } from "uuid";
    import { t } from "../i18n/i18n.svelte";
    import { HandleData } from "./Handle.svelte";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { NodeData } from "./Node.svelte";
    import { Position } from "./Position.svelte";
    import { Size } from "./Size.svelte";

    export class NodeDefinition {
        /**
         * @param {import('./NodeCategory.svelte').Categories} category
         * @param {import('../i18n/i18n.svelte').i18nlabel} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Snippet<[{inputs:HandleData[], outputs:HandleData[]}]>} render
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        constructor(category, name, inputs, outputs, render, icon) {
            /**
             * @type {import('./NodeCategory.svelte').Categories}
             */
            this.category = category;
            /**
             * @type {import('../i18n/i18n.svelte').i18nlabel}
             */
            this.name = name;
            /**
             * @type {HandleDefinition[]}
             */
            this.inputs = inputs;
            /**
             * @type {HandleDefinition[]}
             */
            this.outputs = outputs;
            /**
             * @type {import('svelte').Snippet<[{inputs:HandleData[], outputs:HandleData[]}]>}
             */
            this.render = render;
            /**
             * @type {import('svelte').Component<import('@lucide/svelte').IconProps>}
             */
            this.icon = icon;
        }

        /**
         * @param {number} x
         * @param {number} y
         */
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
        "IO",
        "label.default",
        [],
        [],
        defaultNode,
        CircleQuestionMark,
    );
</script>

{#snippet defaultNode({ inputs, outputs })}
    <p class="text-muted-foreground text-2xl font-body">{t("label.default")}</p>
{/snippet}
