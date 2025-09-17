<script>
    import { getDataContextCleaner } from "../../../context/DataContext.svelte";
    import {
        getEdgeData,
        getEdgeDataAdder,
        getEdgeDataRemover,
    } from "../../../context/EdgeContext.svelte";
    import {
        getCurrentView,
        getGridSize,
        getSidebarToggler,
        getSnapToGrid,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import { EdgeData } from "../../../model/Edge.svelte";
    import { HandleConnection } from "../../../model/HandleConnection.svelte";
    import { NodeData } from "../../../model/Node.svelte";
    import { NodeDefs } from "../../../model/NodeCategory.svelte";
    import { Movement, Transform } from "../../../model/Pipeline.svelte";
    import { Position } from "../../../model/Position.svelte";
    import { Rectangle } from "../../../model/Rectangle.svelte";
    import BlurOut from "../../ui/Transitions/BlurOut.svelte";
    import BaseNode from "./Nodes/BaseNode.svelte";
    import EdgePath from "./Nodes/EdgePath.svelte";
    import PendingEdgePath from "./Nodes/PendingEdgePath.svelte";
    import SelectionRect from "./SelectionRect.svelte";
    import PipelineToolbar from "./Toolbar/PipelineToolbar.svelte";
    /**
     * @typedef {Object} PipelineCanvasProps
     * @prop {{[id:string]:NodeData}} nodes
     * @prop {boolean} pipeChanged
     */

    /** @type {PipelineCanvasProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { nodes = $bindable(), pipeChanged = $bindable(), ...props } = $props();
    const dataCleaner = getDataContextCleaner();
    const edges = getEdgeData();
    const edgeRemover = getEdgeDataRemover();
    const edgeAdder = getEdgeDataAdder();
    const isSnapToGrid = getSnapToGrid();
    const sidebarToggler = getSidebarToggler();
    const currentView = getCurrentView();
    const gridSize = getGridSize();

    const ZOOM_SENSITIVITY = 0.001;
    const EDGE_DETECTION_SENSITIVITY = 10;
    const MIN_ZOOM = 0.001;
    const MAX_ZOOM = 20;

    let hidden = $derived(currentView() !== PIPEVIEW);

    /**
     * @type {HTMLElement}
     */
    let canvasRef = $state();
    /**
     * @type {HTMLElement}
     */
    let canvasViewport = $state();
    /**
     * @type {SVGElement}
     */
    let canvasEdgeport = $state();
    /**
     * @type {Transform}
     */
    let canvasTransform = $state(new Transform(0, 0, 1).reactive());
    let panMode = $state(false);
    let isPanning = $state(false);
    let isDragging = $state(false);
    /**
     * @type {Movement}
     */
    let panStart = $state();
    /**
     * @type {Movement}
     */
    let dragStart = $state();
    /**
     * @type {Movement}
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
     * @type {{[x:string]:Position}}
     */
    let draggingPositions = $state({});
    /**
     * @type {string}
     */
    let dragCore = $state();

    let zoomed = $state(false);
    let moved = $state(false);

    $effect(() => {
        if (pipeChanged) {
            pipeChanged = false;
            moved = true;
        }
    });

    const findHandle = (handleId) => {
        return Object.values(nodes)
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
                    const canvasRect = canvasRef?.getBoundingClientRect();
                    if (canvasRect) {
                        const newNode = template
                            .create(
                                (e.clientX - canvasRect.x) /
                                    canvasTransform.scale -
                                    canvasTransform.x,
                                (e.clientY - canvasRect.y) /
                                    canvasTransform.scale -
                                    canvasTransform.y,
                            )
                            .reactive();
                        nodes[newNode.id] = newNode;
                        isDragging = true;
                        draggingPositions = {};
                        selectedNodeIds = [newNode.id];
                        draggingPositions[newNode.id] = newNode.position;
                        dragCore = newNode.id;

                        dragStart = new Movement(
                            e.clientX -
                                newNode.position.x * canvasTransform.scale,
                            e.clientY -
                                newNode.position.y * canvasTransform.scale,
                            0,
                            0,
                        ).reactive();
                    }
                }
            }
        }
    };

    /**
     * @param {number} delta
     */
    const changeZoom = (delta) => {
        const canvasRect = canvasRef?.getBoundingClientRect();
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
            delete nodes[id];
        });
        selectedEdgeIds.forEach((id) => {
            edgeRemover(id);
            dataCleaner(id);
        });
        const toRemove = [];
        Object.entries(edges()).forEach(([id, edge]) => {
            if (
                selectedNodeIds.includes(edge.endNode) ||
                selectedNodeIds.includes(edge.startNode)
            ) {
                toRemove.push(id);
            }
        });
        toRemove.forEach((id) => {
            edgeRemover(id);
            dataCleaner(id);
        });
        selectedNodeIds = [];
        selectedEdgeIds = [];
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        if (e.target instanceof HTMLElement) {
            if (e.target.closest("[data-handle-id]")) {
                const targetHandle = e.target.closest("[data-handle-id]");
                const targetHandleId =
                    targetHandle.getAttribute("data-handle-id");
                const handle = findHandle(targetHandleId);
                if (handle) {
                    connectStart = new HandleConnection(handle);
                    const canvasRect = canvasRef?.getBoundingClientRect();
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

                        pendingEdge = EdgeData.create(
                            targetHandleId,
                            handle.nodeId,
                            null,
                            null,
                            new Position(x, y),
                        ).reactive();
                    }
                }
                return;
            }
            if (
                e.target.closest("[data-node-id]") &&
                !e.target.closest('[data-node-content="true"]')
            ) {
                const targetNodeEl = e.target.closest("[data-node-id]");
                const targetNodeId = targetNodeEl.getAttribute("data-node-id");
                const targetNode = nodes[targetNodeId];
                if (targetNode) {
                    isDragging = true;
                    draggingPositions = {};
                    if (selectedNodeIds.includes(targetNode.id)) {
                        selectedNodeIds.forEach((id) => {
                            const n = nodes[id];
                            if (n) {
                                draggingPositions[n.id] = n.position;
                            }
                        });
                    } else {
                        selectedNodeIds = [targetNode.id];
                        draggingPositions[targetNode.id] = targetNode.position;
                    }
                    dragCore = targetNode.id;

                    dragStart = new Movement(
                        e.clientX -
                            targetNode.position.x * canvasTransform.scale,
                        e.clientY -
                            targetNode.position.y * canvasTransform.scale,
                        0,
                        0,
                    ).reactive();
                }
                return;
            }
        }
        if (e.button === 1 || panMode) {
            isPanning = true;
            panStart = new Movement(
                e.clientX,
                e.clientY,
                canvasTransform.x,
                canvasTransform.y,
            ).reactive();
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
        const canvasRect = canvasRef?.getBoundingClientRect();
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
            selectStart = new Movement(x, y, 0, 0).reactive();
            selectionRect = new Rectangle(x, y, 0, 0).reactive();
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
                        const cn = nodes[id];
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
        if (isPanning) {
            const dx = (e.clientX - panStart.x) / canvasTransform.scale;
            const dy = (e.clientY - panStart.y) / canvasTransform.scale;
            canvasTransform.x = panStart.tx + dx;
            canvasTransform.y = panStart.ty + dy;
            moved = true;
            return;
        }
        const canvasRect = canvasRef?.getBoundingClientRect();
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
                const selectedN = Object.values(nodes)
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
                const selectedE = Object.values(edges())
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
        if (connectStart && pendingEdge) {
            if (e.target instanceof HTMLElement) {
                const targetHandle = e.target.closest("[data-handle-id]");
                if (targetHandle) {
                    const targetHandleId =
                        targetHandle.getAttribute("data-handle-id");
                    const handle = findHandle(targetHandleId);
                    if (handle) {
                        if (
                            connectStart.connect(handle, Object.values(edges()))
                        ) {
                            pendingEdge.end = handle.id;
                            pendingEdge.endNode = handle.nodeId;
                            pendingEdge.tail = null;
                            edgeAdder(pendingEdge.id, pendingEdge);
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
            const canvasRect = canvasRef?.getBoundingClientRect();
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
        style={`background-image: radial-gradient(circle, hsl(var(--border)/0.5) 1px, transparent 1px);
        background-size: ${gridSize() * canvasTransform.scale}px ${gridSize() * canvasTransform.scale}px;
        background-position: ${canvasTransform.x * canvasTransform.scale + gridSize() / 2}px ${canvasTransform.y * canvasTransform.scale + gridSize() / 2}px;
        `}
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
                {#each Object.entries(edges()) as [id, edge] (id)}
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
            {#each Object.entries(nodes) as [id, node] (id)}
                <BaseNode
                    {node}
                    isSelected={selectedNodeIds.includes(id)}
                    isDragging={isDragging && selectedNodeIds.includes(id)}
                    onClick={onNodeClick}
                />
            {/each}
        </div>
        {@render props.children?.()}
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
