<script module>
    import { ElementRect } from "runed";
    import { getDefinition } from "../../../../model/NodeCategory.svelte";
    import { Pipeline } from "../../../../model/Pipeline.svelte";
    import { Position } from "../../../../model/Position.svelte";
    import { roundMult } from "../../../../utils/MathUtils";

    let lastDragged = $state();
    /**
     * @type {Position}
     */
    let dragOrigin = $state();

    /**
     * @type {string}
     */
    let dragCore = $state();

    /**
     * @type {Object<string, Position>}
     */
    let draggingPositions = $state();

    export const getDragged = () => () => lastDragged;
    export const getIsDragging = () => () => !!dragOrigin;

    /**
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     * @param {ElementRect} rect
     * @param {Pipeline} pipeline
     * @param {(id:string)=>void} selectNode
     */
    export const onToolbarDrag =
        (rect, transform, pipeline, selectNode) =>
        (/** @type {MouseEvent} e */ e) => {
            e.preventDefault();
            if (e.currentTarget instanceof HTMLElement) {
                if (e.currentTarget.hasAttribute("data-template-category")) {
                    const category = e.currentTarget.getAttribute(
                        "data-template-category",
                    );
                    const name =
                        e.currentTarget.getAttribute("data-template-name");
                    const template = getDefinition(category, name);
                    if (template) {
                        if (rect) {
                            const { x, y } = transform.canvasPosition(
                                e.clientX - rect.x,
                                e.clientY - rect.y,
                            );
                            const newNode = template.create(x, y);
                            pipeline.nodes[newNode.id] = newNode;
                            draggingPositions = {};
                            selectNode(newNode.id);
                            draggingPositions[newNode.id] = newNode.position;
                            dragCore = newNode.id;

                            const { x: dragX, y: dragY } =
                                transform.screenPosition(
                                    newNode.position.x,
                                    newNode.position.y,
                                );

                            dragOrigin = new Position(
                                e.clientX - dragX,
                                e.clientY - dragY,
                            );
                            lastDragged = Date.now();
                        }
                    }
                }
            }
        };

    /**
     * Attach order -- FOURTH
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     * @param {Pipeline} pipeline
     * @param {(s:string[])=>boolean} checker
     * @param {()=>boolean} isSnapToGrid
     * @param {()=>number} gridSize
     * @param {()=>string[]} selectedNodes
     * @param {(id:string)=>void} selectNode
     */
    export const attachDragAction = (
        transform,
        pipeline,
        checker,
        isSnapToGrid,
        gridSize,
        selectedNodes,
        selectNode,
    ) => {
        /**
         * @param {MouseEvent} e
         */
        const startDragging = (e) => {
            e.preventDefault();
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.closest("[data-node-id]") &&
                    !e.target.closest('[data-node-content="true"]')
                ) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const targetNodeEl = e.target.closest("[data-node-id]");
                    const targetNodeId =
                        targetNodeEl.getAttribute("data-node-id");
                    const targetNode = pipeline.nodes[targetNodeId];
                    if (targetNode) {
                        draggingPositions = {};
                        if (checker([targetNode.id])) {
                            selectedNodes().forEach((id) => {
                                const n = pipeline.nodes[id];
                                if (n) {
                                    draggingPositions[n.id] = n.position;
                                }
                            });
                        } else {
                            selectNode(targetNode.id);
                            draggingPositions[targetNode.id] =
                                targetNode.position;
                        }
                        dragCore = targetNode.id;

                        const { x: dragX, y: dragY } = transform.screenPosition(
                            targetNode.position.x,
                            targetNode.position.y,
                        );
                        dragOrigin = new Position(
                            e.clientX - dragX,
                            e.clientY - dragY,
                        );
                    }
                    lastDragged = Date.now();
                }
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const dragging = (e) => {
            if (
                dragOrigin &&
                dragCore &&
                draggingPositions &&
                selectedNodes().length > 0
            ) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const corePos = draggingPositions[dragCore];
                if (corePos) {
                    const delta = dragOrigin.delta(e.clientX, e.clientY);
                    let { x: deltaX, y: deltaY } = transform.canvasPosition(
                        delta.x,
                        delta.y,
                        true,
                    );
                    deltaX = deltaX - corePos.x;
                    deltaY = deltaY - corePos.y;
                    selectedNodes().forEach((id) => {
                        const origin = draggingPositions[id];
                        if (origin) {
                            const cn = pipeline.nodes[id];
                            if (cn) {
                                let newX = origin.x + deltaX;
                                let newY = origin.y + deltaY;
                                if (isSnapToGrid()) {
                                    newX = roundMult(newX, gridSize());
                                    newY = roundMult(newY, gridSize());
                                }
                                cn.position.x = newX;
                                cn.position.y = newY;
                            }
                        }
                    });
                    lastDragged = Date.now();
                }
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const stopDragging = (e) => {
            if (dragOrigin) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                dragOrigin = undefined;
                dragCore = undefined;
                draggingPositions = undefined;
                lastDragged = Date.now();
            }
        };

        /**
         * @param {Window} el
         */
        const dragAttachment = (el) => {
            el.addEventListener("mousedown", startDragging);
            el.addEventListener("mousemove", dragging);
            el.addEventListener("mouseup", stopDragging);

            return () => {
                el.removeEventListener("mousedown", startDragging);
                el.removeEventListener("mousemove", dragging);
                el.removeEventListener("mouseup", stopDragging);
            };
        };
        return dragAttachment;
    };
</script>
