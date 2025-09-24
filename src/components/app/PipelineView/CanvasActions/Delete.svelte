<script module>
    import { Pipeline } from "@model/Pipeline.svelte";

    /**
     * @param {()=>string[]} selectedNodes
     * @param {()=>string[]} selectedEdges
     * @param {Pipeline} pipeline
     * @param {Object<string,any>} data
     * @param {()=>void} cleaner
     */
    export const onDelete = (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
        cleaner,
    ) => {
        const nodes = selectedNodes();
        nodes.forEach((id) => {
            delete pipeline.nodes[id];
        });
        selectedEdges().forEach((id) => {
            delete pipeline.edges[id];
            delete data[id];
        });
        const toRemove = nodes.flatMap((nid) =>
            pipeline.getConnectedEdges(nid).map((e) => e.id),
        );
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
     * @param {()=>void} cleaner
     */
    export const attachDeleteAction = (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
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
                onDelete(selectedNodes, selectedEdges, pipeline, data, cleaner);
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
