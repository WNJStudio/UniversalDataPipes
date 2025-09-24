<script module>
    import { Pipeline } from "@model/Pipeline.svelte";

    /**
     * @param {()=>string[]} selectedNodes
     * @param {()=>string[]} selectedEdges
     * @param {Pipeline} pipeline
     * @param {Object<string,any>} data
     * @param {(n:string[])=>boolean} checker
     * @param {()=>void} cleaner
     */
    export const onDelete = (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
        checker,
        cleaner,
    ) => {
        selectedNodes().forEach((id) => {
            delete pipeline.nodes[id];
        });
        selectedEdges().forEach((id) => {
            delete pipeline.edges[id];
            delete data[id];
        });
        const toRemove = [];
        Object.entries(pipeline.edges).forEach(([id, edge]) => {
            if (checker([edge.endNode, edge.startNode])) {
                toRemove.push(id);
            }
        });
        toRemove.forEach((id) => {
            delete pipeline.edges[id];
            delete data[id];
        });
        cleaner();
    };

    /**
     * @param {()=>string[]} selectedNodes
     * @param {()=>string[]} selectedEdges
     * @param {Pipeline} pipeline
     * @param {Object<string,any>} data
     * @param {(n:string[])=>boolean} checker
     * @param {()=>void} cleaner
     */
    export const attachDeleteAction = (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
        checker,
        cleaner,
    ) => {
        const onKeyDown = (e) => {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (e.target instanceof HTMLElement) {
                    if (
                        e.target.nodeName === "INPUT" ||
                        e.target.nodeName === "TEXTAREA"
                    ) {
                        return;
                    }
                }
                onDelete(
                    selectedNodes,
                    selectedEdges,
                    pipeline,
                    data,
                    checker,
                    cleaner,
                );
            }
        };

        /**
         * @param {Window} el
         */
        const deleteAttachment = (el) => {
            el.addEventListener("keydown", onKeyDown);

            return () => {
                el.removeEventListener("keydown", onKeyDown);
            };
        };
        return deleteAttachment;
    };
</script>
