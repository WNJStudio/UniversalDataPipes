<script module>
    import { t } from "@i18n/i18n.svelte";
    import { CircleQuestionMark } from "@lucide/svelte";
    import { v4 } from "uuid";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { NodeData } from "./Node.svelte";
    import { Position } from "./Position.svelte";
    import { Size } from "./Size.svelte";
    import DefaultNode from "@app/Nodes/Default/DefaultNode.svelte";

    export class NodeDefinition {
        /**
         * @param {string} category
         * @param {import('@i18n/i18n.svelte').i18nlabel} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Component<import('@app/Nodes/NodeRegistry.svelte').NodeProps>} component
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        constructor(category, name, inputs, outputs, component, icon) {
            /**
             * @type {string}
             */
            this.category = category;
            /**
             * @type {import('@i18n/i18n.svelte').i18nlabel}
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
             * @type {import('svelte').Component<import('@app/Nodes/NodeRegistry.svelte').NodeProps>}
             */
            this.component = component;
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
        DefaultNode,
        CircleQuestionMark,
    );
</script>
