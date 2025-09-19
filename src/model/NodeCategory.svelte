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
         * @param {string} label
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         * @param {NodeDefinition[]} nodes
         */
        constructor(name, label, icon, nodes = []) {
            /**
             * @type {Categories}
             */
            this.name = $state(name);
            /**
             * @type {string}
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
         * @param {string} name
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
    const IO = new NodeCategory("IO", "Input/Output", FolderInput);
    const TEXT = new NodeCategory("TEXT", "Text Processing", Combine);
    const OBJ = new NodeCategory("OBJ", "Object Processing", Funnel);

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
        "Text File Input",
        [],
        [new HandleDefinition("Text Content", HandleTypes.string, "OUT")],
        tfin,
        FileText,
    );
    IO.createDefinition(
        "Object Preview",
        [new HandleDefinition("Input objects", HandleTypes.object, "IN")],
        [],
        ojout,
        Braces,
    );
    TEXT.createDefinition(
        "JSON Parser",
        [new HandleDefinition("Input text", HandleTypes.string, "IN")],
        [new HandleDefinition("Output objects", HandleTypes.object, "OUT")],
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
