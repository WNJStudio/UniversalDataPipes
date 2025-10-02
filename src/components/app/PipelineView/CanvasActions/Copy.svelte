<script module>
    /**
     * @param {()=>string[]} selectedNodes
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     */
    export const onCopy = async (selectedNodes, pipeline) => {
        const sn = selectedNodes();
        if (sn.length > 0) {
            const nodes = sn.map((nid) => pipeline.nodes[nid]);
            const edges = pipeline.getConnectedBetween(sn);

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
        }
    };

    /**
     * @param {()=>string[]} selectedNodes
     * @param {import('@model/Pipeline.svelte').Pipeline} pipeline
     */
    export const attachCopyAction = (selectedNodes, pipeline) => {
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
                if (e.key?.toLowerCase() === "c") {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    onCopy(selectedNodes, pipeline);
                }
            }
        };
        /**
         * @param {Window} el
         */
        const copyAttachment = (el) => {
            el.addEventListener("keydown", onKeyDown);
            return () => {
                el.removeEventListener("keydown", onKeyDown);
            };
        };
        return copyAttachment;
    };
</script>
