<script module>
    import { Pipeline } from "@model/Pipeline.svelte";
    import { roundMult } from "@utils/MathUtils";

    /**
     * @type {string} id of the node currently being resized
     */
    let resizingNode = $state();
    /**
     * @type {number}
     */
    let lastResized = $state();

    export const getResized = () => () => lastResized;
    export const getResizingNode = () => () => resizingNode;

    /**
     * Attach order -- THIRD
     * @param {import('@model/Transform.svelte').Transform} transform
     * @param {Pipeline} pipeline
     * @param {()=>boolean} isSnapToGrid
     * @param {()=>number} gridSize
     */
    export const attachResizeAction = (
        transform,
        pipeline,
        isSnapToGrid,
        gridSize,
    ) => {
        /**
         * @param {MouseEvent} e
         */
        const startResizing = (e) => {
            if (e.target instanceof HTMLElement) {
                if (e.target.closest("[data-resize-handle]")) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const targetHandle = e.target.closest(
                        "[data-resize-handle]",
                    );
                    resizingNode = targetHandle.parentElement.id;
                    lastResized = Date.now();
                }
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const resizing = (e) => {
            if (resizingNode) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const nodeRect = document
                    .getElementById(resizingNode)
                    ?.getBoundingClientRect();
                const cn = pipeline.nodes[resizingNode];
                if (nodeRect && cn) {
                    const { x: deltaX, y: deltaY } = transform.canvasPosition(
                        e.clientX - nodeRect.x - nodeRect.width,
                        e.clientY - nodeRect.y - nodeRect.height,
                        true,
                    );

                    if (!cn.minSize.height) {
                        cn.minSize.height = nodeRect.height;
                        cn.size.height = nodeRect.height;
                    }
                    if (!cn.minSize.width) {
                        cn.minSize.width = nodeRect.width;
                        cn.size.width = nodeRect.width;
                    }
                    let newW = cn.size.width
                        ? cn.size.width + deltaX
                        : nodeRect.width + deltaX;
                    let newH = cn.size.height
                        ? cn.size.height + deltaY
                        : nodeRect.height + deltaY;
                    newW = Math.max(
                        cn.minSize.width,
                        isSnapToGrid() ? roundMult(newW, gridSize()) : newW,
                    );
                    newH = Math.max(
                        cn.minSize.height,
                        isSnapToGrid() ? roundMult(newH, gridSize()) : newH,
                    );
                    cn.size.width = newW;
                    cn.size.height = newH;
                    lastResized = Date.now();
                }
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const stopResizing = (e) => {
            if (resizingNode) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                resizingNode = undefined;
                lastResized = Date.now();
            }
        };

        /**
         * @param {Window} el
         */
        const resizeAttachment = (el) => {
            el.addEventListener("mousedown", startResizing);
            el.addEventListener("mousemove", resizing);
            el.addEventListener("mouseup", stopResizing);

            return () => {
                el.removeEventListener("mousedown", startResizing);
                el.removeEventListener("mousemove", resizing);
                el.removeEventListener("mouseup", stopResizing);
            };
        };
        return resizeAttachment;
    };
</script>
