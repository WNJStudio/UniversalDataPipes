<script>
    import { EdgeData } from "../../../../model/Edge.svelte";

    /**
     * @typedef {Object} PendingEdgePathProps
     * @prop {EdgeData} pendingEdge
     * @prop {import('../../../../model/Transform.svelte').Transform} canvasTransform
     * @prop {HTMLElement} canvasView
     */
    /** @type {PendingEdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let { pendingEdge, canvasTransform, canvasView, ...props } = $props();

    const path = $derived.by(() => {
        const startHandle = document.querySelector(
            `[data-handle-id="${pendingEdge.start}"]`,
        );
        if (startHandle) {
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
    class="stroke-primary [stroke-dasharray:0,24] [stroke-linecap:round] stroke-[12] fill-none"
/>
