<script>
    import { ElementRect } from "runed";
    import { blur } from "svelte/transition";
    import { dataContext } from "../../../context/DataContext.svelte";
    import { pipelineContext } from "../../../context/PipelineContext.svelte";
    import {
        getCurrentView,
        getGridSize,
        getPattern,
        getPatternOffset,
        getSnapToGrid,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import { Transform } from "../../../model/Transform.svelte";
    import { attachConnectAction } from "./CanvasActions/Connect.svelte";
    import { attachDeleteAction } from "./CanvasActions/Delete.svelte";
    import {
        attachDragAction,
        onToolbarDrag,
    } from "./CanvasActions/Drag.svelte";
    import { attachPanAction, getIsPanning } from "./CanvasActions/Pan.svelte";
    import { attachResizeAction } from "./CanvasActions/Resize.svelte";
    import {
        attachSelectAction,
        getNodeSelectionChecker,
        getNodeSelectionSetter,
        getSelectedEdges,
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

    let canvasTransform = $state(new Transform(0, 0, 1));

    const isPanning = getIsPanning();
    const selectNode = getNodeSelectionSetter();
    const areNodesSelected = getNodeSelectionChecker();
    const cleanSelection = getSelectionCleaner();

    const selectedNodes = getSelectedNodes();
    const selectedEdges = getSelectedEdges();
</script>

{#if !hidden}
    <div transition:blur class={["flex-1 relative"]}>
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div
            {@attach attachWheel(canvasRect, canvasTransform)}
            bind:this={canvasRef}
            role="definition"
            data-canvas="true"
            class={[
                "w-full h-full absolute top-0 left-0 overflow-hidden",
                isPanning() ? "cursor-grab" : "",
            ]}
            style={`${getPattern(canvasTransform.scale)};${getPatternOffset(canvasTransform)};`}
            oncontextmenu={(e) => e.preventDefault()}
        >
            <div
                bind:this={canvasViewport}
                data-canvas-view="true"
                class="w-full h-full relative"
                style={`transform: translate(${canvasTransform.x * canvasTransform.scale}px, ${canvasTransform.y * canvasTransform.scale}px) scale(${canvasTransform.scale});transform-origin: top left;`}
            >
                <SelectionRect />
                <svg
                    data-edge-view="true"
                    class="absolute w-full h-full transform-[scale(1)] left-0 top-0 overflow-visible"
                >
                    {#each Object.entries(pipeline.edges) as [id, edge] (id)}
                        <EdgePath {edge} {canvasTransform} {canvasViewRect} />
                    {/each}
                    <PendingEdgePath {canvasViewRect} {canvasTransform} />
                </svg>
                {#each Object.entries(pipeline.nodes) as [id, node] (id)}
                    <BaseNode {node} />
                {/each}
            </div>
        </div>
    </div>
{/if}
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
        selectedEdges,
        pipeline,
        data,
        areNodesSelected,
        cleanSelection,
    )}
    {@attach attachPanAction(canvasTransform)}
    {@attach attachConnectAction(canvasRect, canvasTransform, pipeline)}
    {@attach attachResizeAction(
        canvasTransform,
        pipeline,
        isSnapToGrid,
        gridSize,
    )}
    {@attach attachDragAction(
        canvasTransform,
        pipeline,
        areNodesSelected,
        isSnapToGrid,
        gridSize,
        selectedNodes,
        selectNode,
    )}
    {@attach attachSelectAction(canvasRect, canvasTransform, pipeline)}
/>
