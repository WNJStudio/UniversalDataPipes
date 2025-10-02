<script module>
    import { EdgeData } from "@model/Edge.svelte";
    import { NodeData } from "@model/Node.svelte";
    import { v4 } from "uuid";

    /**
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     * @param {()=>void} cleaner
     * @param {(nodes:string|string[])=>void} nodeSetter
     * @param {(edges:string|string[])=>void} edgeSetter
     */
    export const onPaste = async (
        pipeline,
        cleaner,
        nodeSetter,
        edgeSetter,
    ) => {
        const clipContent = await navigator.clipboard.readText();
        try {
            const { nodes: nodeos, edges: edgeos } = JSON.parse(clipContent);
            const nodes = [];
            const edges = [];
            const nodeMap = {};
            const handleMap = {};
            if (nodeos && nodeos instanceof Array) {
                nodeos.forEach((n) => {
                    const newN = NodeData.create(n);
                    const newNid = v4();
                    nodeMap[newN.id] = newNid;
                    newN.id = newNid;
                    newN.inputs.forEach((ih) => {
                        const newHid = v4();
                        handleMap[ih.id] = newHid;
                        ih.id = newHid;
                        ih.nodeId = newNid;
                    });
                    newN.outputs.forEach((oh) => {
                        const newHid = v4();
                        handleMap[oh.id] = newHid;
                        oh.id = newHid;
                        oh.nodeId = newNid;
                    });
                    newN.position.x = newN.position.x + 10;
                    newN.position.y = newN.position.y + 10;
                    nodes.push(newN);
                });
            }
            if (edgeos && edgeos instanceof Array) {
                edgeos.forEach((e) => {
                    const newE = EdgeData.create(e);
                    newE.id = v4();
                    newE.start = handleMap[newE.start];
                    newE.end = handleMap[newE.end];
                    newE.startNode = nodeMap[newE.startNode];
                    newE.endNode = nodeMap[newE.endNode];
                    edges.push(newE);
                });
            }

            nodes.forEach((n) => (pipeline.nodes[n.id] = n));
            edges.forEach((e) => (pipeline.edges[e.id] = e));
            cleaner();
            nodeSetter(nodes.map((n) => n.id));
            edgeSetter(edges.map((e) => e.id));
            await navigator.clipboard.writeText(
                JSON.stringify(
                    {
                        nodes: nodes.map((n) => n.toJSON()),
                        edges: edges.map((e) => e.toJSON()),
                    },
                    null,
                    4,
                ),
            );
        } catch (e) {
            // TODO: toaster
            console.error("Paste failed: ", e);
        }
    };

    /**
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     * @param {()=>void} cleaner
     * @param {(nodes:string|string[])=>void} nodeSetter
     * @param {(edges:string|string[])=>void} edgeSetter
     */
    export const attachPasteAction = (
        pipeline,
        cleaner,
        nodeSetter,
        edgeSetter,
    ) => {
        /**
         * @param {KeyboardEvent} e
         */
        const onKeyDown = (e) => {
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.nodeName === "INPUT" ||
                    e.target.nodeName === "TEXTAREA"
                ) {
                    return;
                }
            }
            if (e.ctrlKey) {
                if (e.key?.toLowerCase() === "v") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    onPaste(pipeline, cleaner, nodeSetter, edgeSetter);
                }
            }
        };
        /**
         * @param {Window} el
         */
        const pasteAttachment = (el) => {
            el.addEventListener("keydown", onKeyDown);
            return () => {
                el.removeEventListener("keydown", onKeyDown);
            };
        };
        return pasteAttachment;
    };
</script>
