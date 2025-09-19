<script>
    import { ElementRect } from "runed";
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
    import { NodeDefs } from "../../../model/NodeCategory.svelte";
    import { Position } from "../../../model/Position.svelte";
    import { Rectangle } from "../../../model/Rectangle.svelte";
    import { Transform } from "../../../model/Transform.svelte";
    import BlurOut from "../../ui/Transitions/BlurOut.svelte";
    import BaseNode from "./Nodes/BaseNode.svelte";
    import EdgePath from "./Nodes/EdgePath.svelte";
    import PendingEdgePath from "./Nodes/PendingEdgePath.svelte";
    import SelectionRect from "./SelectionRect.svelte";
    import PipelineToolbar from "./Toolbar/PipelineToolbar.svelte";
    import { dataContext } from "../../../context/DataContext.svelte";

    const isSnapToGrid = getSnapToGrid();
    const sidebarToggler = getSidebarToggler();
    const currentView = getCurrentView();
    const gridSize = getGridSize();
    const pipeline = pipelineContext.get();
    const data = dataContext.get();

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

    const findHandle = (handleId) => {
        return Object.values(pipeline.nodes)
            .flatMap((n) => [...n.inputs, ...n.outputs])
            .find((v) => v.id === handleId);
    };
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
                const template = NodeDefs[category]?.nodes?.find?.(
                    (n) => n.name === name,
                );
                if (template) {
                    if (canvasRect) {
                        const newNode = template.create(
                            (e.clientX - canvasRect.x) / canvasTransform.scale -
                                canvasTransform.x,
                            (e.clientY - canvasRect.y) / canvasTransform.scale -
                                canvasTransform.y,
                        );
                        pipeline.nodes[newNode.id] = newNode;
                        isDragging = true;
                        draggingPositions = {};
                        selectedNodeIds = [newNode.id];
                        draggingPositions[newNode.id] = newNode.position;
                        dragCore = newNode.id;

                        dragStart = new Position(
                            e.clientX -
                                newNode.position.x * canvasTransform.scale,
                            e.clientY -
                                newNode.position.y * canvasTransform.scale,
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
        const newScale = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, canvasTransform.scale + delta),
        );

        const centerX = canvasRect.width / 2;
        const centerY = canvasRect.height / 2;

        const mousePointX = centerX / canvasTransform.scale - canvasTransform.x;
        const mousePointY = centerY / canvasTransform.scale - canvasTransform.y;

        const newX = centerX / newScale - mousePointX;
        const newY = centerY / newScale - mousePointY;
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
                const handle = findHandle(targetHandleId);
                if (handle) {
                    connectStart = new HandleConnection(handle);
                    if (canvasRect) {
                        const x =
                            (e.clientX -
                                canvasRect.left -
                                canvasTransform.x * canvasTransform.scale) /
                            canvasTransform.scale;
                        const y =
                            (e.clientY -
                                canvasRect.top -
                                canvasTransform.y * canvasTransform.scale) /
                            canvasTransform.scale;

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

                    dragStart = new Position(
                        e.clientX -
                            targetNode.position.x * canvasTransform.scale,
                        e.clientY -
                            targetNode.position.y * canvasTransform.scale,
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
            const x =
                (e.clientX -
                    canvasRect.left -
                    canvasTransform.x * canvasTransform.scale) /
                canvasTransform.scale;
            const y =
                (e.clientY -
                    canvasRect.top -
                    canvasTransform.y * canvasTransform.scale) /
                canvasTransform.scale;
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
                const deltaX =
                    (e.clientX - dragStart.x) / canvasTransform.scale -
                    corePos.x;
                const deltaY =
                    (e.clientY - dragStart.y) / canvasTransform.scale -
                    corePos.y;

                selectedNodeIds.forEach((id) => {
                    const origin = draggingPositions[id];
                    if (origin) {
                        const cn = pipeline.nodes[id];
                        if (cn) {
                            let newX = origin.x + deltaX;
                            let newY = origin.y + deltaY;
                            if (isSnapToGrid()) {
                                newX =
                                    Math.round(
                                        (origin.x + deltaX) / gridSize(),
                                    ) * gridSize();
                                newY =
                                    Math.round(
                                        (origin.y + deltaY) / gridSize(),
                                    ) * gridSize();
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
            const node = document.getElementById(resizingNode);
            const cn = pipeline.nodes[resizingNode];
            if (node && cn) {
                const nodeRect = node.getBoundingClientRect();
                const deltaX =
                    (e.clientX - nodeRect.x - nodeRect.width) /
                    canvasTransform.scale;
                const deltaY =
                    (e.clientY - nodeRect.y - nodeRect.height) /
                    canvasTransform.scale;
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
                    const minWGrid =
                        Math.round(cn.minSize.width / gridSize()) * gridSize();
                    const minHGrid =
                        Math.round(cn.minSize.height / gridSize()) * gridSize();
                    newW = Math.max(
                        minWGrid,
                        Math.round(newW / gridSize()) * gridSize(),
                    );
                    newH = Math.max(
                        minHGrid,
                        Math.round(newH / gridSize()) * gridSize(),
                    );
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
            const dx = (e.clientX - panStart.origin.x) / canvasTransform.scale;
            const dy = (e.clientY - panStart.origin.y) / canvasTransform.scale;

            canvasTransform.x = panStart.canvas.x + dx;
            canvasTransform.y = panStart.canvas.y + dy;
            moved = true;
            return;
        }
        if (connectStart && pendingEdge) {
            if (canvasRect) {
                const x =
                    (e.clientX -
                        canvasRect.left -
                        canvasTransform.x * canvasTransform.scale) /
                    canvasTransform.scale;
                const y =
                    (e.clientY -
                        canvasRect.top -
                        canvasTransform.y * canvasTransform.scale) /
                    canvasTransform.scale;
                pendingEdge.tail = new Position(x, y);
            }
        } else if (selectStart) {
            if (canvasRect) {
                const currentX =
                    (e.clientX -
                        canvasRect.left -
                        canvasTransform.x * canvasTransform.scale) /
                    canvasTransform.scale;
                const currentY =
                    (e.clientY -
                        canvasRect.top -
                        canvasTransform.y * canvasTransform.scale) /
                    canvasTransform.scale;
                const startX = selectStart.x;
                const startY = selectStart.y;

                const rectX = Math.min(startX, currentX);
                const rectY = Math.min(startY, currentY);
                const rectWidth = Math.abs(startX - currentX);
                const rectHeight = Math.abs(startY - currentY);

                selectionRect = new Rectangle(
                    rectX,
                    rectY,
                    rectWidth,
                    rectHeight,
                );
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
        isDragging = false;
        isPanning = false;
        resizingNode = undefined;
        if (connectStart && pendingEdge) {
            if (e.target instanceof HTMLElement) {
                const targetHandle = e.target.closest("[data-handle-id]");
                if (targetHandle) {
                    const targetHandleId =
                        targetHandle.getAttribute("data-handle-id");
                    const handle = findHandle(targetHandleId);
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
        if (panMode) {
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

            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            const mousePointX =
                mouseX / canvasTransform.scale - canvasTransform.x;
            const mousePointY =
                mouseY / canvasTransform.scale - canvasTransform.y;

            const newX = mouseX / newScale - mousePointX;
            const newY = mouseY / newScale - mousePointY;
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
                        canvasView={canvasViewport}
                        bind:zoomed
                        bind:moved
                    />
                {/each}
                {#if pendingEdge}
                    <PendingEdgePath
                        {pendingEdge}
                        canvasView={canvasViewport}
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
