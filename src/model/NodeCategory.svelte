<script module>
    import { HandleData } from "./Handle.svelte";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { DefaultNodeDef, NodeDefinition } from "./NodeDefinition.svelte";

    /**
     * Reactive
     */
    export class NodeCategory {
        /**
         * Reactive
         * @param {string} name
         * @param {import('@i18n/i18n.svelte').i18nlabel} label
         * @param {NodeDefinition[]} nodes
         */
        constructor(name, label, nodes = []) {
            /**
             * @type {string}
             */
            this.name = $state(name);
            /**
             * @type {import('@i18n/i18n.svelte').i18nlabel}
             */
            this.label = $state(label);
            /**
             * @type {NodeDefinition[]}
             */
            this.nodes = $state(nodes);
        }
        /**
         * @param {import('@i18n/i18n.svelte').i18nlabel} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Component<import('@app/Nodes/NodeRegistry.svelte').NodeProps>} component
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        createDefinition(name, inputs, outputs, component, icon) {
            this.nodes.push(
                new NodeDefinition(
                    this.name,
                    name,
                    inputs,
                    outputs,
                    component,
                    icon,
                ),
            );
        }

        /**
         * @param {NodeDefinition} def
         */
        addDefinition(def) {
            this.nodes.push(def);
        }
    }

    /**
     * @typedef {keyof categories} Categories
     */

    const categories = {
        FileInput: new NodeCategory(
            "FileInput",
            "label.node.category.fileinput",
        ),
        Constant: new NodeCategory("Constant", "label.node.category.constant"),
        Export: new NodeCategory("Export", "label.node.category.export"),
        HTTP: new NodeCategory("HTTP", "label.node.category.http"),
        OperationList: new NodeCategory(
            "OperationList",
            "label.node.category.list",
        ),
        Preview: new NodeCategory("Preview", "label.node.category.preview"),
        ProcessBoolean: new NodeCategory(
            "ProcessBoolean",
            "label.node.category.boolean",
        ),
        ProcessNumber: new NodeCategory(
            "ProcessNumber",
            "label.node.category.number",
        ),
        ProcessObject: new NodeCategory(
            "ProcessObject",
            "label.node.category.object",
        ),
        ProcessString: new NodeCategory(
            "ProcessString",
            "label.node.category.string",
        ),
    };

    export const NodeDefs = $state(categories);

    /**
     *
     * @param {string} category
     * @param {string} name
     * @returns {NodeDefinition}
     */
    export const getDefinition = (category, name) => {
        return (
            NodeDefs[category]?.nodes?.find?.(
                (/** @type {{ name: string; }} */ n) => n.name === name,
            ) || DefaultNodeDef
        );
    };
</script>
