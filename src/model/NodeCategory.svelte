<script module>
    import {
        Brackets,
        Combine,
        FileText,
        FolderInput,
        Funnel,
    } from "@lucide/svelte";
    import { HandleData } from "./Handle.svelte";
    import { HandleDefinition } from "./HandleDefinition.svelte";
    import { DefaultNodeDef, NodeDefinition } from "./NodeDefinition.svelte";
    import TextFileInputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/TextFileInputNode.svelte";
    import ArrayOutputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/ArrayOutputNode.svelte";

    export class NodeCategory {
        /**
         * @param {string} name
         * @param {string} label
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         * @param {NodeDefinition[]} nodes
         */
        constructor(name, label, icon, nodes = []) {
            this.name = name;
            this.label = label;
            this.icon = icon;
            this.nodes = nodes;
        }
        /**
         * @param {string} name
         * @param {HandleDefinition[]} inputs
         * @param {HandleDefinition[]} outputs
         * @param {import('svelte').Snippet<[{inputs:HandleData[], outputs:HandleData[]}]>} render
         * @param {import('svelte').Component<import('@lucide/svelte').IconProps>} icon
         */
        addNode(name, inputs, outputs, render, icon) {
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
    }
    const IO = new NodeCategory("IO", "Input/Output", FolderInput);
    const TEXT = new NodeCategory("TEXT", "Text Processing", Combine);
    const OBJ = new NodeCategory("OBJ", "Object Processing", Funnel);

    /**
     * @type {{[x:string]:NodeCategory}}
     */
    export const NodeDefs = { IO, TEXT, OBJ };

    /**
     *
     * @param {string} category
     * @param {string} name
     * @returns {NodeDefinition}
     */
    export const getDefinition = (category, name) => {
        return (
            NodeDefs[category]?.nodes?.find?.((n) => n.name === name) ||
            DefaultNodeDef
        );
    };

    IO.addNode(
        "Text File Input Node",
        [],
        [new HandleDefinition("Text Content", "string", "OUT", "#889922")],
        tfin,
        FileText,
    );
    IO.addNode(
        "Object Array Output Node",
        [
            new HandleDefinition(
                "Input array of objects or object",
                "Object[]|Object",
                "IN",
                "#332299",
            ),
        ],
        [],
        ojout,
        Brackets,
    );
</script>

{#snippet tfin({ inputs, outputs })}
    <TextFileInputNode {inputs} {outputs}></TextFileInputNode>
{/snippet}
{#snippet ojout({ inputs, outputs })}
    <ArrayOutputNode {inputs} {outputs}></ArrayOutputNode>
{/snippet}
