<script>
    import { ElementRect } from "runed";
    import { dataContext } from "../../../context/DataContext.svelte";
    import { pipelineContext } from "../../../context/PipelineContext.svelte";
    import {
        getCurrentView,
        getGridSize,
        getPattern,
        getPatternOffset,
        getSidebarToggler,
        getSnapToGrid,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import { EdgeData } from "../../../model/Edge.svelte";
    import { HandleConnection } from "../../../model/HandleConnection.svelte";
    import { getDefinition } from "../../../model/NodeCategory.svelte";
    import { Position } from "../../../model/Position.svelte";
    import { Rectangle } from "../../../model/Rectangle.svelte";
    import { Transform } from "../../../model/Transform.svelte";
    import { clamp, roundMult } from "../../../utils/MathUtils";
    import BlurOut from "../../ui/Transitions/BlurOut.svelte";
    import BaseNode from "./Nodes/BaseNode.svelte";
    import EdgePath from "./Nodes/EdgePath.svelte";
    import PendingEdgePath from "./Nodes/PendingEdgePath.svelte";
    import SelectionRect from "./SelectionRect.svelte";
    import PipelineToolbar from "./Toolbar/PipelineToolbar.svelte";
    import { nodeRectContext } from "../../../context/NodeRectContext.svelte";

    const isSnapToGrid = getSnapToGrid();
    const sidebarToggler = getSidebarToggler();
    const currentView = getCurrentView();
    const gridSize = getGridSize();
    const pipeline = pipelineContext.get();
    const data = dataContext.get();
    /**
     * @type {Object<string,()=>DOMRect>}
     */
    const nodeRects = $state({});
    nodeRectContext.set(nodeRects);

    const ZOOM_SENSITIVITY = 0.001;
    const EDGE_DETECTION_SENSITIVITY = 10;
    const MIN_ZOOM = 0.001;
    const MAX_ZOOM = 20;

    let hidden = $derived(currentView() !== PIPEVIEW);

    /**
     * @type {HTMLElement}
     */
    let canvasRef = $state();
    let canvasRect = new ElementRect(() => canvasRef);
    /**
     * @type {HTMLElement}
     */
    let canvasViewport = $state();
    let canvasViewRect = new ElementRect(() => canvasViewport);
    /**
     * @type {SVGElement}
     */
    let canvasEdgeport = $state();

    let canvasTransform = $state(new Transform(0, 0, 1));
    let panMode = $state(false);
    let isPanning = $state(false);
    let isDragging = $state(false);
    /**
     * @type {{origin:Position, canvas:Position}}
     */
    let panStart = $state();
    /**
     * @type {Position}
     */
    let dragStart = $state();
    /**
     * @type {Position}
     */
    let selectStart = $state();
    /**
     * @type {HandleConnection}
     */
    let connectStart = $state();
    /**
     * @type {Rectangle}
     */
    let selectionRect = $state();
    /**
     * @type {EdgeData}
     */
    let pendingEdge = $state();
    /**
     * @type {string[]}
     */
    let selectedNodeIds = $state([]);
    /**
     * @type {string[]}
     */
    let selectedEdgeIds = $state([]);
    /**
     * @type {Object<string,Position>}
     */
    let draggingPositions = $state({});
    /**
     * @type {string}
     */
    let dragCore = $state();
    /**
     * @type {string}
     */
    let resizingNode = $state();

    let zoomed = $state(false);
    let moved = $state(false);
    let justDragged = $state(false);

    /**
     * @param {MouseEvent} e
     */
    const onToolbarDrag = (e) => {
        if (e.currentTarget instanceof HTMLElement) {
            if (e.currentTarget.hasAttribute("data-template-category")) {
                const category = e.currentTarget.getAttribute(
                    "data-template-category",
                );
                const name = e.currentTarget.getAttribute("data-template-name");
                const template = getDefinition(category, name);
                if (template) {
                    if (canvasRect) {
                        const { x, y } = canvasTransform.canvasPosition(
                            e.clientX - canvasRect.x,
                            e.clientY - canvasRect.y,
                        );
                        const newNode = template.create(x, y);
                        pipeline.nodes[newNode.id] = newNode;
                        isDragging = true;
                        draggingPositions = {};
                        selectedNodeIds = [newNode.id];
                        draggingPositions[newNode.id] = newNode.position;
                        dragCore = newNode.id;

                        const { x: dragX, y: dragY } =
                            canvasTransform.screenPosition(
                                newNode.position.x,
                                newNode.position.y,
                            );

                        dragStart = new Position(
                            e.clientX - dragX,
                            e.clientY - dragY,
                        );
                    }
                }
            }
        }
    };

    /**
     * @param {number} delta
     */
    const changeZoom = (delta) => {
        if (!canvasRect) {
            return;
        }
        const newScale = clamp(
            canvasTransform.scale + delta,
            MIN_ZOOM,
            MAX_ZOOM,
        );

        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;

        const { x, y } = canvasTransform.canvasPosition(centerX, centerY);

        const newX = centerX / newScale - x;
        const newY = centerY / newScale - y;
        canvasTransform.x = newX;
        canvasTransform.y = newY;
        canvasTransform.scale = newScale;
        zoomed = true;
    };

    const onZoomIn = () => {
        changeZoom(0.01);
    };

    const onZoomOut = () => {
        changeZoom(-0.01);
    };

    const onDelete = () => {
        selectedNodeIds.forEach((id) => {
            delete pipeline.nodes[id];
        });
        selectedEdgeIds.forEach((id) => {
            delete pipeline.edges[id];
            delete data[id];
        });
        const toRemove = [];
        Object.entries(pipeline.edges).forEach(([id, edge]) => {
            if (
                selectedNodeIds.includes(edge.endNode) ||
                selectedNodeIds.includes(edge.startNode)
            ) {
                toRemove.push(id);
            }
        });
        toRemove.forEach((id) => {
            delete pipeline.edges[id];
            delete data[id];
        });
        selectedNodeIds = [];
        selectedEdgeIds = [];
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        if (e.target instanceof HTMLElement && !panMode) {
            if (e.target.closest("[data-handle-id]")) {
                const targetHandle = e.target.closest("[data-handle-id]");
                const targetHandleId =
                    targetHandle.getAttribute("data-handle-id");
                const handle = pipeline.findHandle(targetHandleId);
                if (handle) {
                    connectStart = new HandleConnection(handle);
                    if (canvasRect) {
                        const { x, y } = canvasTransform.canvasPosition(
                            e.clientX - canvasRect.x,
                            e.clientY - canvasRect.y,
                        );

                        pendingEdge = EdgeData.createPending(
                            targetHandleId,
                            handle.nodeId,
                            new Position(x, y),
                        );
                    }
                }
                return;
            }
            if (e.target.closest("[data-resize-handle]")) {
                const targetHandle = e.target.closest("[data-resize-handle]");
                resizingNode = targetHandle.parentElement.id;
                return;
            }
            if (
                e.target.closest("[data-node-id]") &&
                !e.target.closest('[data-node-content="true"]')
            ) {
                const targetNodeEl = e.target.closest("[data-node-id]");
                const targetNodeId = targetNodeEl.getAttribute("data-node-id");
                const targetNode = pipeline.nodes[targetNodeId];
                if (targetNode) {
                    isDragging = true;
                    draggingPositions = {};
                    if (selectedNodeIds.includes(targetNode.id)) {
                        selectedNodeIds.forEach((id) => {
                            const n = pipeline.nodes[id];
                            if (n) {
                                draggingPositions[n.id] = n.position;
                            }
                        });
                    } else {
                        selectedNodeIds = [targetNode.id];
                        draggingPositions[targetNode.id] = targetNode.position;
                    }
                    dragCore = targetNode.id;

                    const { x: dragX, y: dragY } =
                        canvasTransform.screenPosition(
                            targetNode.position.x,
                            targetNode.position.y,
                        );
                    dragStart = new Position(
                        e.clientX - dragX,
                        e.clientY - dragY,
                    );
                }
                return;
            }
        }
        if (e.button === 1 || panMode) {
            isPanning = true;
            panStart = {
                origin: new Position(e.clientX, e.clientY),
                canvas: new Position(canvasTransform.x, canvasTransform.y),
            };

            return;
        }
        if (
            e.target !== e.currentTarget &&
            e.target !== canvasViewport &&
            e.target !== canvasEdgeport
        ) {
            return;
        }

        selectedNodeIds = [];
        selectedEdgeIds = [];
        if (canvasRect) {
            const { x, y } = canvasTransform.canvasPosition(
                e.clientX - canvasRect.x,
                e.clientY - canvasRect.y,
            );
            selectStart = new Position(x, y);
            selectionRect = new Rectangle(x, y, 0, 0);
        }
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseMove = (e) => {
        if (
            isDragging &&
            selectedNodeIds.length > 0 &&
            dragCore &&
            dragStart &&
            draggingPositions
        ) {
            const corePos = draggingPositions[dragCore];
            if (corePos) {
                const delta = dragStart.delta(e.clientX, e.clientY);
                let { x: deltaX, y: deltaY } = canvasTransform.canvasPosition(
                    delta.x,
                    delta.y,
                    true,
                );
                deltaX = deltaX - corePos.x;
                deltaY = deltaY - corePos.y;
                selectedNodeIds.forEach((id) => {
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
                moved = true;
            }
            return;
        }
        if (resizingNode) {
            const nodeRect = nodeRects[resizingNode]?.();
            const cn = pipeline.nodes[resizingNode];
            if (nodeRect && cn) {
                const { x: deltaX, y: deltaY } = canvasTransform.canvasPosition(
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
                if (isSnapToGrid()) {
                    const minWGrid = roundMult(cn.minSize.width, gridSize());
                    const minHGrid = roundMult(cn.minSize.height, gridSize());
                    newW = Math.max(minWGrid, roundMult(newW, gridSize()));
                    newH = Math.max(minHGrid, roundMult(newH, gridSize()));
                } else {
                    newW = Math.max(cn.minSize.width, newW);
                    newH = Math.max(cn.minSize.height, newH);
                }
                cn.size.width = newW;
                cn.size.height = newH;
                moved = true;
            }
            return;
        }
        if (isPanning) {
            const delta = panStart.origin.delta(e.clientX, e.clientY);
            const { x: dx, y: dy } = canvasTransform.canvasPosition(
                delta.x,
                delta.y,
                true,
            );

            canvasTransform.x = panStart.canvas.x + dx;
            canvasTransform.y = panStart.canvas.y + dy;
            moved = true;
            return;
        }
        if (connectStart && pendingEdge) {
            if (canvasRect) {
                const { x, y } = canvasTransform.canvasPosition(
                    e.clientX - canvasRect.x,
                    e.clientY - canvasRect.y,
                );
                pendingEdge.tail.x = x;
                pendingEdge.tail.y = y;
            }
        } else if (selectStart) {
            if (canvasRect) {
                const { x: currentX, y: currentY } =
                    canvasTransform.canvasPosition(
                        e.clientX - canvasRect.x,
                        e.clientY - canvasRect.y,
                    );
                const startX = selectStart.x;
                const startY = selectStart.y;

                selectionRect.x = Math.min(startX, currentX);
                selectionRect.y = Math.min(startY, currentY);
                selectionRect.width = Math.abs(startX - currentX);
                selectionRect.height = Math.abs(startY - currentY);

                const selLeft = selectionRect.x;
                const selTop = selectionRect.y;
                const selRight = selLeft + selectionRect.width;
                const selBottom = selTop + selectionRect.height;
                const selectedN = Object.values(pipeline.nodes)
                    .filter((node) => {
                        const nodeRect = nodeRects[node.id]?.();
                        if (!nodeRect) return false;
                        const nodeLeft = node.position.x;
                        const nodeTop = node.position.y;
                        const nodeRight =
                            nodeLeft + nodeRect.width / canvasTransform.scale;
                        const nodeBottom =
                            nodeTop + nodeRect.height / canvasTransform.scale;

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
                            if (tl === 0) {
                                moved = true;
                            } else {
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
        }
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseUp = (e) => {
        dragStart = undefined;
        dragCore = undefined;
        draggingPositions = undefined;
        if (isDragging) {
            justDragged = true;
        }
        isDragging = false;
        isPanning = false;
        resizingNode = undefined;
        if (connectStart && pendingEdge) {
            if (e.target instanceof HTMLElement) {
                const targetHandle = e.target.closest("[data-handle-id]");
                if (targetHandle) {
                    const targetHandleId =
                        targetHandle.getAttribute("data-handle-id");
                    const handle = pipeline.findHandle(targetHandleId);
                    if (handle) {
                        if (
                            connectStart.connect(
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
        }
        connectStart = undefined;
        pendingEdge = undefined;
        selectStart = undefined;
        selectionRect = undefined;
        moved = false;
        zoomed = false;
    };
    /**
     * @param {MouseEvent} e
     * @param {string} id
     */
    const onNodeClick = (e, id) => {
        e.stopPropagation();
        if (panMode || justDragged) {
            justDragged = false;
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
    const onEdgeClick = (e, id) => {
        e.stopPropagation();
        if (panMode) {
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
     * @param {KeyboardEvent} e
     */
    const onKeydown = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.nodeName === "INPUT" ||
                    e.target.nodeName === "TEXTAREA"
                ) {
                    return;
                }
            }
            onDelete();
        } else if (e.key?.toLowerCase() === "p") {
            panMode = true;
        } else if (e.key?.toLowerCase() === "v") {
            panMode = false;
        } else if (e.ctrlKey && e.key?.toLowerCase() === "b") {
            sidebarToggler();
        }
    };

    /**
     * @param {WheelEvent} e
     */
    const onWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (!canvasRect) {
                return;
            }
            const delta = -e.deltaY * ZOOM_SENSITIVITY;
            const newScale = Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, canvasTransform.scale + delta),
            );

            const mouseX = e.clientX - canvasRect.x;
            const mouseY = e.clientY - canvasRect.y;
            const { x, y } = canvasTransform.canvasPosition(mouseX, mouseY);

            const newX = mouseX / newScale - x;
            const newY = mouseY / newScale - y;
            canvasTransform.x = newX;
            canvasTransform.y = newY;
            canvasTransform.scale = newScale;
            zoomed = true;
        }
    };

    /**
     * @param {HTMLElement} el
     */
    const attachWheel = (el) => {
        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    };
</script>

<BlurOut class={["flex-1 relative"]} {hidden}>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        {@attach attachWheel}
        bind:this={canvasRef}
        role="definition"
        data-canvas="true"
        class={[
            "w-full h-full absolute top-0 left-0 overflow-hidden",
            panMode || isPanning ? "cursor-grab" : "",
        ]}
        style={`${getPattern(canvasTransform.scale)};${getPatternOffset(canvasTransform)};`}
        oncontextmenu={(e) => e.preventDefault()}
        onmousedown={handleMouseDown}
        onmousemove={handleMouseMove}
        onmouseup={handleMouseUp}
    >
        <div
            bind:this={canvasViewport}
            data-canvas-view="true"
            class="w-full h-full relative"
            style={`transform: translate(${canvasTransform.x * canvasTransform.scale}px, ${canvasTransform.y * canvasTransform.scale}px) scale(${canvasTransform.scale});transform-origin: top left;`}
        >
            {#if selectionRect}
                <SelectionRect rect={selectionRect} />
            {/if}
            <svg
                bind:this={canvasEdgeport}
                data-edge-view="true"
                class="absolute w-full h-full transform-[scale(1)] left-0 top-0 overflow-visible"
            >
                {#each Object.entries(pipeline.edges) as [id, edge] (id)}
                    <EdgePath
                        {edge}
                        isSelected={selectedEdgeIds.includes(id)}
                        {onEdgeClick}
                        {canvasTransform}
                        {canvasViewRect}
                        bind:zoomed
                        bind:moved
                    />
                {/each}
                {#if pendingEdge}
                    <PendingEdgePath
                        {pendingEdge}
                        {canvasViewRect}
                        {canvasTransform}
                    />
                {/if}
            </svg>
            {#each Object.entries(pipeline.nodes) as [id, node] (id)}
                <BaseNode
                    {node}
                    isSelected={selectedNodeIds.includes(id)}
                    isDragging={isDragging && selectedNodeIds.includes(id)}
                    onClick={onNodeClick}
                />
            {/each}
        </div>
    </div>
</BlurOut>
<PipelineToolbar
    {hidden}
    bind:panMode
    hasSelection={selectedNodeIds.length > 0 || selectedEdgeIds.length > 0}
    currentZoom={canvasTransform.scale}
    {onToolbarDrag}
    {onZoomIn}
    {onZoomOut}
    {onDelete}
/>

<svelte:window onkeydown={onKeydown} />
