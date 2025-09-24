<script module>
    import { onCopy } from "./Copy.svelte";
    import { onDelete } from "./Delete.svelte";

    /**
     * @param {()=>string[]} selectedNodes
     * @param {()=>string[]} selectedEdges
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     * @param {Object<string,any>} data
     * @param {()=>void} cleaner
     */
    export const onCut = async (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
        cleaner,
    ) => {
        await onCopy(selectedNodes, pipeline);
        onDelete(selectedNodes, selectedEdges, pipeline, data, cleaner);
    };

    /**
     * @param {()=>string[]} selectedNodes
     * @param {()=>string[]} selectedEdges
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     * @param {Object<string,any>} data
     * @param {()=>void} cleaner
     */
    export const attachCutAction = (
        selectedNodes,
        selectedEdges,
        pipeline,
        data,
        cleaner,
    ) => {
        /**
         * @param {KeyboardEvent} e
         */
        const onKeyDown = (e) => {
            if (e.ctrlKey) {
                if (e.key?.toLowerCase() === "x") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    onCut(
                        selectedNodes,
                        selectedEdges,
                        pipeline,
                        data,
                        cleaner,
                    );
                }
            }
        };
        /**
         * @param {Window} el
         */
        const cutAttachment = (el) => {
            el.addEventListener("keydown", onKeyDown);
            return () => {
                el.removeEventListener("keydown", onKeyDown);
            };
        };
        return cutAttachment;
    };
</script>
