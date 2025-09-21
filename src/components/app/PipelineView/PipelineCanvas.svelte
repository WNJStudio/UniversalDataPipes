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
    import { Position } from "../../../model/Position.svelte";
    import { Transform } from "../../../model/Transform.svelte";
    import { roundMult } from "../../../utils/MathUtils";
    import BlurOut from "../../ui/Transitions/BlurOut.svelte";
    import { attachDeleteAction } from "./CanvasActions/Delete.svelte";
    import {
        attachDragAction,
        onToolbarDrag,
    } from "./CanvasActions/Drag.svelte";
    import {
        attachPanAction,
        getIsPanning,
        getPanMode,
    } from "./CanvasActions/Pan.svelte";
    import {
        attachSelectAction,
        getNodeSelectionChecker,
        getNodeSelectionSetter,
        getSelectedNodes,
        getSelectionCleaner,
    } from "./CanvasActions/Select.svelte";
    import {
        attachWheel,
        onZoomIn,
        onZoomOut,
    } from "./CanvasActions/Zoom.svelte";
    import BaseNode from "./Nodes/BaseNode.svelte";
    import EdgePath from "./Nodes/EdgePath.svelte";
    import PendingEdgePath from "./Nodes/PendingEdgePath.svelte";
    import SelectionRect from "./SelectionRect.svelte";
    import PipelineToolbar from "./Toolbar/PipelineToolbar.svelte";

    const isSnapToGrid = getSnapToGrid();
    const sidebarToggler = getSidebarToggler();
    const currentView = getCurrentView();
    const gridSize = getGridSize();
    const pipeline = pipelineContext.get();
    const data = dataContext.get();

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

    const isPanning = getIsPanning();
    const panMode = getPanMode();
    const selectNode = getNodeSelectionSetter();
    const areNodesSelected = getNodeSelectionChecker();
    const cleanSelection = getSelectionCleaner();

    const selectedNodes = getSelectedNodes();

    /**
     * @type {HandleConnection}
     */
    let connectStart = $state();

    /**
     * @type {EdgeData}
     */
    let pendingEdge = $state();

    /**
     * @type {string}
     */
    let resizingNode = $state();

    /**
     * @param {MouseEvent} e
     */
    const handleMouseDown = (e) => {
        e.preventDefault();
        if (e.target instanceof HTMLElement && !panMode()) {
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
        }
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseMove = (e) => {
        if (resizingNode) {
            const nodeRect = document
                .getElementById(resizingNode)
                ?.getBoundingClientRect();
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
            }
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
        }
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseUp = (e) => {
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
    };

    /**
     * @param {KeyboardEvent} e
     */
    const onKeydown = (e) => {
        if (e.ctrlKey && e.key?.toLowerCase() === "b") {
            sidebarToggler();
        }
    };
</script>

<BlurOut class={["flex-1 relative"]} {hidden}>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        {@attach attachWheel(canvasRect, canvasTransform)}
        {@attach attachDragAction(
            canvasTransform,
            pipeline,
            areNodesSelected,
            isSnapToGrid,
            gridSize,
            selectedNodes,
            selectNode,
        )}
        {@attach attachPanAction(canvasTransform)}
        {@attach attachSelectAction(canvasRect, canvasTransform, pipeline)}
        bind:this={canvasRef}
        role="definition"
        data-canvas="true"
        class={[
            "w-full h-full absolute top-0 left-0 overflow-hidden",
            isPanning() ? "cursor-grab" : "",
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
            <SelectionRect />
            <svg
                bind:this={canvasEdgeport}
                data-edge-view="true"
                class="absolute w-full h-full transform-[scale(1)] left-0 top-0 overflow-visible"
            >
                {#each Object.entries(pipeline.edges) as [id, edge] (id)}
                    <EdgePath {edge} {canvasTransform} {canvasViewRect} />
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
                <BaseNode {node} />
            {/each}
        </div>
    </div>
</BlurOut>
<PipelineToolbar
    {hidden}
    onToolbarDrag={onToolbarDrag(
        canvasRect,
        canvasTransform,
        pipeline,
        selectNode,
    )}
    currentZoom={canvasTransform.scale}
    onZoomIn={() => onZoomIn(canvasRect, canvasTransform)}
    onZoomOut={() => onZoomOut(canvasRect, canvasTransform)}
/>

<svelte:window
    {@attach attachDeleteAction(
        selectedNodes,
        pipeline,
        data,
        areNodesSelected,
        cleanSelection,
    )}
    onkeydown={onKeydown}
/>
