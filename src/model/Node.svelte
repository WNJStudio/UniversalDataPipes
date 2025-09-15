<script module>
    import {
        Brackets,
        CircleQuestionMark,
        Combine,
        FileText,
        FolderInput,
        Funnel,
    } from "@lucide/svelte";
    import { v4 } from "uuid";
    import { Reactive } from "./Reactive.svelte";
    import TextFileInputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/TextFileInputNode.svelte";
    import ArrayOutputNode from "../components/app/PipelineView/Nodes/NodeTypes/IO/ArrayOutputNode.svelte";
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
            /**
             * @type {string} the id of the edge
             */
            this.id = id;
            /**
             * @type {string} the id of the starting handle
             */
            this.start = start;
            /**
             * @type {string} the id of the starting node
             */
            this.startNode = startNode;
            /**
             * @type {string} the id of the ending handle
             */
            this.end = end;
            /**
             * @type {string} the id of the ending node
             */
            this.endNode = endNode;
            /**
             * @type {Position} transient tail to track pending edge
             */
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

        /**
         * @param {any} obj
         * @returns {boolean}
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (
                !obj.id ||
                !obj.start ||
                !obj.startNode ||
                !obj.end ||
                !obj.endNode
            ) {
                return false;
            }
            return true;
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
         * @param {EdgeData[]} edges
         */
        connect(end, edges) {
            if (
                edges.some(
                    (edge) =>
                        edge.start === this.start.id && edge.end === end.id,
                )
            ) {
                return false;
            }
            if (
                edges.some(
                    (edge) =>
                        edge.end === this.start.id && edge.start === end.id,
                )
            ) {
                return false;
            }
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

        /**
         * @param {any} obj
         * @returns {boolean}
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (
                !obj.id ||
                !obj.nodeId ||
                !obj.name ||
                !obj.type ||
                !obj.dir ||
                !obj.color
            ) {
                return false;
            }
            return true;
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

        /**
         * @param {any} obj
         * @returns {boolean}
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (!obj.id || !obj.category || !obj.name || !obj.position) {
                return false;
            }
            if (typeof obj.position !== "object") {
                return false;
            }
            if (isNaN(obj.position.x) || isNaN(obj.position.y)) {
                return false;
            }
            if (obj.inputs) {
                if (!(obj.inputs instanceof Array)) {
                    return false;
                }
                if (obj.inputs.some((e) => !HandleData.validate(e))) {
                    return false;
                }
            }
            if (obj.outputs) {
                if (!(obj.outputs instanceof Array)) {
                    return false;
                }
                if (obj.outputs.some((n) => !HandleData.validate(n))) {
                    return false;
                }
            }
            return true;
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
        FileText,
    );
    IO.addNode(
        "Object Array Output Node",
        [
            new HandleDefinition(
                "Input array or objects",
                "any",
                "IN",
                "#3311AA",
            ),
        ],
        [],
        ojout,
        Brackets,
    );

    /**
     * @type {{[x:string]:NodeCategory}}
     */
    export const NodeDefs = { IO, TEXT, OBJ };

    const DefaultNodeDef = new NodeDefinition(
        "default",
        "default",
        [],
        [],
        defaultNode,
        CircleQuestionMark,
    );

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
</script>

{#snippet defaultNode({ inputs, outputs })}
    <p class="text-muted-foreground text-2xl font-body">Default</p>
{/snippet}
{#snippet tfin({ inputs, outputs })}
    <TextFileInputNode {inputs} {outputs}></TextFileInputNode>
{/snippet}
{#snippet ojout({ inputs, outputs })}
    <ArrayOutputNode {inputs} {outputs}></ArrayOutputNode>
{/snippet}
