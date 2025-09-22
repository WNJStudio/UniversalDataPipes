<script module>
    import { ElementRect } from "runed";
    import { Pipeline } from "../../../../model/Pipeline.svelte";
    import { Position } from "../../../../model/Position.svelte";
    import { Rectangle } from "../../../../model/Rectangle.svelte";
    import { getDragged } from "./Drag.svelte";
    import { getPanMode } from "./Pan.svelte";
    const EDGE_DETECTION_SENSITIVITY = 10;

    /**
     * @type {Rectangle}
     */
    let selectionRect = $state();
    /**
     * @type {Position}
     */
    let selectionOrigin = $state();

    /**
     * @type {string[]}
     */
    let selectedNodeIds = $state([]);
    /**
     * @type {string[]}
     */
    let selectedEdgeIds = $state([]);

    const panMode = getPanMode();
    const lastDragged = getDragged();

    export const getSelectionRectangle = () => () => selectionRect;
    export const getSelectedNodes = () => () => selectedNodeIds;
    export const getSelectedEdges = () => () => selectedEdgeIds;
    export const getNodeSelectionSetter =
        () => (/** @type {string|string[]} */ nodes) => {
            selectedNodeIds = [nodes].flat();
        };
    export const getNodeSelectionRemover = () => (/** @type {string} */ id) => {
        selectedNodeIds = selectedNodeIds.filter((ii) => ii !== id);
    };
    export const getEdgeSelectionSetter =
        () => (/** @type {string|string[]} */ edges) => {
            selectedEdgeIds = [edges].flat();
        };
    export const getNodeSelectionChecker =
        () => (/** @type {string[]} */ nodes) => {
            return nodes.some((node) => selectedNodeIds.includes(node));
        };

    export const getNodeSelectionCleaner = () => () => {
        selectedNodeIds = [];
    };
    export const getEdgeSelectionCleaner = () => () => {
        selectedEdgeIds = [];
    };
    export const getEdgeSelectionChecker =
        () => (/** @type {string[]} */ edges) => {
            return edges.some((edge) => selectedEdgeIds.includes(edge));
        };
    export const getSelectionCleaner = () => () => {
        selectedNodeIds = [];
        selectedEdgeIds = [];
    };
    export const getHasSelection = () => () =>
        selectedEdgeIds.length > 0 || selectedNodeIds.length > 0;

    /**
     * @param {MouseEvent} e
     * @param {string} id
     */
    export const onNodeClick = (e, id) => {
        e.stopPropagation();
        if (panMode() || lastDragged() + 100 > Date.now()) {
            return;
        }
        if (e.shiftKey) {
            if (selectedNodeIds.includes(id)) {
                selectedNodeIds = selectedNodeIds.filter((ii) => ii !== id);
            } else {
                selectedNodeIds.push(id);
            }
        } else {
            selectedNodeIds = [id];
        }
    };
    /**
     * @param {MouseEvent} e
     * @param {string} id
     */
    export const onEdgeClick = (e, id) => {
        e.stopPropagation();
        if (panMode()) {
            return;
        }
        if (e.shiftKey) {
            if (selectedEdgeIds.includes(id)) {
                selectedEdgeIds = selectedEdgeIds.filter((ii) => ii !== id);
            } else {
                selectedEdgeIds.push(id);
            }
        } else {
            selectedEdgeIds = [id];
        }
    };

    /**
     * Attach order -- LAST
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     * @param {Pipeline} pipeline
     */
    export const attachSelectAction = (rect, transform, pipeline) => {
        /**
         * @param {MouseEvent} e
         */
        const startSelecting = (e) => {
            e.preventDefault();
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.closest(
                        "[data-handle-id], [data-resize-handle], [data-node-id]",
                    )
                ) {
                    return;
                }
                if (
                    !e.target.closest("[data-canvas]") &&
                    !e.target.closest("[data-canvas-view]") &&
                    !e.target.closest("[data-edge-view]")
                ) {
                    return;
                }
            }

            selectedNodeIds = [];
            selectedEdgeIds = [];
            if (rect && transform) {
                const { x, y } = transform.canvasPosition(
                    e.clientX - rect.x,
                    e.clientY - rect.y,
                );
                selectionOrigin = new Position(x, y);
                selectionRect = new Rectangle(x, y, 0, 0);
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const selecting = (e) => {
            if (selectionOrigin && selectionRect && rect && transform) {
                const { x, y } = transform.canvasPosition(
                    e.clientX - rect.x,
                    e.clientY - rect.y,
                );

                selectionRect.x = Math.min(selectionOrigin.x, x);
                selectionRect.y = Math.min(selectionOrigin.y, y);
                selectionRect.width = Math.abs(selectionOrigin.x - x);
                selectionRect.height = Math.abs(selectionOrigin.y - y);

                const selLeft = selectionRect.x;
                const selTop = selectionRect.y;
                const selRight = selLeft + selectionRect.width;
                const selBottom = selTop + selectionRect.height;
                const selectedN = Object.values(pipeline.nodes)
                    .filter((node) => {
                        const nodeRect = document
                            .getElementById(node.id)
                            ?.getBoundingClientRect();
                        if (!nodeRect) return false;
                        const nodeLeft = node.position.x;
                        const nodeTop = node.position.y;
                        const nodeRight =
                            nodeLeft + nodeRect.width / transform.scale;
                        const nodeBottom =
                            nodeTop + nodeRect.height / transform.scale;

                        return (
                            nodeRight > selLeft &&
                            nodeLeft < selRight &&
                            nodeBottom > selTop &&
                            nodeTop < selBottom
                        );
                    })
                    .map((n) => n.id);
                const selectedE = Object.values(pipeline.edges)
                    .filter((edge) => {
                        const edgePath = document.getElementById(edge.id);
                        if (!edgePath) return false;
                        if (edgePath instanceof SVGPathElement) {
                            const tl = edgePath.getTotalLength();
                            if (tl !== 0) {
                                for (
                                    let cl = 0,
                                        p = edgePath.getPointAtLength(cl);
                                    cl < tl;
                                    cl += EDGE_DETECTION_SENSITIVITY,
                                        p = edgePath.getPointAtLength(cl)
                                ) {
                                    if (
                                        p.x < selRight &&
                                        p.x > selLeft &&
                                        p.y < selBottom &&
                                        p.y > selTop
                                    ) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    })
                    .map((e) => e.id);
                selectedNodeIds = selectedN;
                selectedEdgeIds = selectedE;
            }
        };
        /**
         * @param {MouseEvent} _e
         */
        const stopSelecting = (_e) => {
            if (selectionOrigin || selectionRect) {
                selectionOrigin = undefined;
                selectionRect = undefined;
            }
        };
        /**
         * @param {Window} el
         */
        const selectAttachment = (el) => {
            el.addEventListener("mousedown", startSelecting);
            el.addEventListener("mousemove", selecting);
            el.addEventListener("mouseup", stopSelecting);

            return () => {
                el.removeEventListener("mousedown", startSelecting);
                el.removeEventListener("mousemove", selecting);
                el.removeEventListener("mouseup", stopSelecting);
            };
        };
        return selectAttachment;
    };
</script>
