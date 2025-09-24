<script module>
    import { EdgeData } from "@model/Edge.svelte";
    import { HandleConnection } from "@model/HandleConnection.svelte";
    import { Pipeline } from "@model/Pipeline.svelte";
    import { Position } from "@model/Position.svelte";
    import { ElementRect } from "runed";

    /**
     * @type {HandleConnection}
     */
    let connection = $state();
    /**
     * @type {EdgeData}
     */
    let pendingEdge = $state();

    export const getPendingEdge = () => () => pendingEdge;
    /**
     * Attach order -- SECOND
     * @param {ElementRect} rect
     * @param {import('@model/Transform.svelte').Transform} transform
     * @param {Pipeline} pipeline
     */
    export const attachConnectAction = (rect, transform, pipeline) => {
        /**
         * @param {MouseEvent} e
         */
        const startConnecting = (e) => {
            e.preventDefault();
            if (e.target instanceof HTMLElement) {
                if (e.target.closest("[data-handle-id]") && transform && rect) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const targetHandle = e.target.closest("[data-handle-id]");
                    const targetHandleId =
                        targetHandle.getAttribute("data-handle-id");
                    const handle = pipeline.findHandle(targetHandleId);
                    if (handle) {
                        connection = new HandleConnection(handle);
                        const { x, y } = transform.canvasPosition(
                            e.clientX - rect.x,
                            e.clientY - rect.y,
                        );

                        pendingEdge = EdgeData.createPending(
                            targetHandleId,
                            handle.nodeId,
                            new Position(x, y),
                        );
                    }
                    return;
                }
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const connecting = (e) => {
            if (connection && pendingEdge && rect && transform) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const { x, y } = transform.canvasPosition(
                    e.clientX - rect.x,
                    e.clientY - rect.y,
                );
                pendingEdge.tail.x = x;
                pendingEdge.tail.y = y;
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const stopConnecting = (e) => {
            if (connection && pendingEdge) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (e.target instanceof HTMLElement) {
                    const targetHandle = e.target.closest("[data-handle-id]");
                    if (targetHandle) {
                        const targetHandleId =
                            targetHandle.getAttribute("data-handle-id");
                        const handle = pipeline.findHandle(targetHandleId);
                        if (handle) {
                            if (
                                connection.connect(
                                    handle,
                                    Object.values(pipeline.edges),
                                )
                            ) {
                                pendingEdge.end = handle.id;
                                pendingEdge.endNode = handle.nodeId;
                                pendingEdge.tail = null;
                                pipeline.edges[pendingEdge.id] = pendingEdge;
                            }
                        }
                    }
                }
                connection = undefined;
                pendingEdge = undefined;
            }
        };

        /**
         * @param {Window} el
         */
        const connectAttachment = (el) => {
            el.addEventListener("mousedown", startConnecting);
            el.addEventListener("mousemove", connecting);
            el.addEventListener("mouseup", stopConnecting);

            return () => {
                el.removeEventListener("mousedown", startConnecting);
                el.removeEventListener("mousemove", connecting);
                el.removeEventListener("mouseup", stopConnecting);
            };
        };
        return connectAttachment;
    };
</script>
