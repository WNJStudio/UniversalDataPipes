<script>
    import { EdgeData } from "../../../../model/Edge.svelte";
    import { Transform } from "../../../../model/Pipeline.svelte";

    /**
     * @typedef {Object} PendingEdgePathProps
     * @prop {EdgeData} pendingEdge
     * @prop {Transform} canvasTransform
     */
    /** @type {PendingEdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let { pendingEdge, canvasTransform, ...props } = $props();

    const path = $derived.by(() => {
        const startHandle = document.querySelector(
            `[data-handle-id="${pendingEdge.start}"]`,
        );
        if (startHandle) {
            const canvasView = startHandle.closest('[data-canvas-view="true"]');
            if (canvasView) {
                const startRect = startHandle.getBoundingClientRect();
                const viewRect = canvasView.getBoundingClientRect();
                const startX =
                    (startRect.left + startRect.width / 2 - viewRect.left) /
                    canvasTransform.scale;
                const startY =
                    (startRect.top + startRect.height / 2 - viewRect.top) /
                    canvasTransform.scale;

                const { x: endX, y: endY } = pendingEdge.tail;

                return `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
            }
        }
        return "";
    });
</script>

<path
    d={path}
    class="stroke-primary [stroke-dasharray:5,5] stroke-2 fill-none"
/>
