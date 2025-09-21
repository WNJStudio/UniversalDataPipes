<script module>
    import {
        Braces,
        Combine,
        FileText,
        FolderInput,
        Funnel,
    } from "@lucide/svelte";
    import ObjectOutputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/ObjectOutputNode.svelte";
    import TextFileInputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/TextFileInputNode.svelte";
    import { HandleData, HandleTypes } from "./Handle.svelte";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { DefaultNodeDef, NodeDefinition } from "./NodeDefinition.svelte";
    import JsonParserNode from "../components/app/PipelineView/Nodes/NodeTypes/Text/JSONParserNode.svelte";
    /**
     * @typedef {"IO"|"TEXT"|"OBJ"} Categories
     */

    /**
     * Reactive
     */
    export class NodeCategory {
        /**
         * Reactive
         * @param {Categories} name
         * @param {import('../i18n/i18n.svelte').i18nlabel} label
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         * @param {NodeDefinition[]} nodes
         */
        constructor(name, label, icon, nodes = []) {
            /**
             * @type {Categories}
             */
            this.name = $state(name);
            /**
             * @type {import('../i18n/i18n.svelte').i18nlabel}
             */
            this.label = $state(label);
            /**
             * @type {import('svelte').Component<import('@lucide/svelte').IconProps>}
             */
            this.icon = $state(icon);
            /**
             * @type {NodeDefinition[]}
             */
            this.nodes = $state(nodes);
        }
        /**
         * @param {import('../i18n/i18n.svelte').i18nlabel} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Snippet<[{inputs:HandleData[], outputs:HandleData[]}]>} render
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        createDefinition(name, inputs, outputs, render, icon) {
            this.nodes.push(
                new NodeDefinition(
                    this.name,
                    name,
                    inputs,
                    outputs,
                    render,
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
    const IO = new NodeCategory("IO", "label.node.category.io", FolderInput);
    const TEXT = new NodeCategory("TEXT", "label.node.category.text", Combine);
    const OBJ = new NodeCategory("OBJ", "label.node.category.obj", Funnel);

    export const NodeDefs = $state({ IO, TEXT, OBJ });

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

    IO.createDefinition(
        "label.node.textinput",
        [],
        [
            new HandleDefinition(
                "label.node.handle.textcontent",
                HandleTypes.string,
                "OUT",
            ),
        ],
        tfin,
        FileText,
    );
    IO.createDefinition(
        "label.node.objectpreview",
        [
            new HandleDefinition(
                "label.node.handle.inputobjects",
                HandleTypes.object,
                "IN",
            ),
        ],
        [],
        ojout,
        Braces,
    );
    TEXT.createDefinition(
        "label.node.jsonparser",
        [
            new HandleDefinition(
                "label.node.handle.inputtext",
                HandleTypes.string,
                "IN",
            ),
        ],
        [
            new HandleDefinition(
                "label.node.handle.outputobjects",
                HandleTypes.object,
                "OUT",
            ),
        ],
        jsonparser,
        Braces,
    );
</script>

{#snippet tfin({ inputs, outputs })}
    <TextFileInputNode {inputs} {outputs}></TextFileInputNode>
{/snippet}
{#snippet ojout({ inputs, outputs })}
    <ObjectOutputNode {inputs} {outputs}></ObjectOutputNode>
{/snippet}
{#snippet jsonparser({ inputs, outputs })}
    <JsonParserNode {inputs} {outputs}></JsonParserNode>
{/snippet}
