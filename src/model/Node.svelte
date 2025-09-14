<script module>
    import { Combine, File, FolderInput, Funnel } from "@lucide/svelte";
    import { v4 } from "uuid";
    import { Reactive } from "./Reactive.svelte";
    import TextFileInputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/TextFileInputNode.svelte";
    export class Position extends Reactive {
        /**
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
        }
    }
    export class EdgeData extends Reactive {
        /**
         * @param {string} id
         * @param {string} start start handleId
         * @param {string} startNode start nodeId
         * @param {string} endNode end NodeId
         * @param {string} end end handleId
         * @param {Position} tail
         */
        constructor(id, start, startNode, end, endNode, tail) {
            super();
            this.id = id;
            this.start = start;
            this.startNode = startNode;
            this.end = end;
            this.endNode = endNode;
            this.tail = tail;
        }
        /**
         * @param {string} start
         * @param {string} startNode
         * @param {string} end
         * @param {string} endNode
         * @param {Position} tail
         */
        static create(start, startNode, end, endNode, tail) {
            return new EdgeData(v4(), start, startNode, end, endNode, tail);
        }
    }

    export class HandleConnection {
        /**
         * @param {HandleData} start
         */
        constructor(start) {
            this.start = start;
        }

        /**
         * @param {HandleData} end
         */
        connect(end) {
            if (this.start.id === end.id) {
                return false;
            }
            if (
                this.start.type !== "any" &&
                end.type !== "any" &&
                this.start.type !== end.type
            ) {
                return false;
            }
            if (this.start.dir === end.dir) {
                return false;
            }
            if (this.start.nodeId === end.nodeId) {
                return false;
            }
            this.end = end;
            return true;
        }
    }
    export class HandleData extends Reactive {
        /**
         *
         * @param {string} id
         * @param {string} name
         * @param {string} nodeId
         * @param {string} type
         * @param {string} color
         * @param {"IN"|"OUT"} dir
         */
        constructor(id, nodeId, name, type, dir, color) {
            super();
            this.id = id;
            this.nodeId = nodeId;
            this.name = name;
            this.type = type;
            this.dir = dir;
            this.color = color;
        }
    }
    export class NodeData extends Reactive {
        /**
         * @param {string} id
         * @param {string} category
         * @param {string} name
         * @param {Position}position
         * @param {HandleData[]} inputs
         * @param {HandleData[]} outputs
         */
        constructor(
            id,
            category,
            name,
            position = new Position(0, 0),
            inputs = [],
            outputs = [],
        ) {
            super();
            this.id = id;
            this.category = category;
            this.name = name;
            this.position = position;
            this.inputs = inputs;
            this.outputs = outputs;
        }
    }
    export class HandleDefinition {
        /**
         * @param {string} name
         * @param {string} type
         * @param {string} color
         * @param {"IN"|"OUT"} dir
         */
        constructor(name, type, dir, color) {
            this.type = type;
            this.dir = dir;
            this.color = color;
            this.name = name;
        }

        /**
         * @param {string} nodeId
         */
        create(nodeId) {
            return new HandleData(
                v4(),
                nodeId,
                this.name,
                this.type,
                this.dir,
                this.color,
            );
        }
    }
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
                this.inputs.map((i) => i.create(nodeId)),
                this.outputs.map((o) => o.create(nodeId)),
            );
        }
    }
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
    // Instantiate the node definitions and put them here
    const IO = new NodeCategory("IO", "Input/Output", FolderInput);
    const TEXT = new NodeCategory("TEXT", "Text Processing", Combine);
    const OBJ = new NodeCategory("OBJ", "Object Processing", Funnel);

    IO.addNode(
        "Text File Input Node",
        [],
        [new HandleDefinition("Text Content", "string", "OUT", "#889922")],
        tfin,
        File,
    );

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
        return NodeDefs[category]?.nodes?.find?.((n) => n.name === name);
    };
</script>

{#snippet tfin({ inputs, outputs })}
    <TextFileInputNode {inputs} {outputs}></TextFileInputNode>
{/snippet}
