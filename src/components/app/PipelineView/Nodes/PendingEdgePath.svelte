<script>
    import { ElementRect } from "runed";
    import { getPendingEdge } from "../CanvasActions/Connect.svelte";

    /**
     * @typedef {Object} PendingEdgePathProps
     * @prop {import('@model/Transform.svelte').Transform} canvasTransform
     * @prop {ElementRect} canvasViewRect
     */
    /** @type {PendingEdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let { canvasTransform, canvasViewRect, ...props } = $props();

    const pendingEdge = getPendingEdge();

    const path = $derived.by(() => {
        if (pendingEdge()) {
            const startHandle = document.querySelector(
                `[data-handle-id="${pendingEdge().start}"]`,
            );
            if (startHandle) {
                if (canvasViewRect) {
                    const startRect = startHandle.getBoundingClientRect();
                    const startX =
                        (startRect.left +
                            startRect.width / 2 -
                            canvasViewRect.x) /
                        canvasTransform.scale;
                    const startY =
                        (startRect.top +
                            startRect.height / 2 -
                            canvasViewRect.y) /
                        canvasTransform.scale;

                    const { x: endX, y: endY } = pendingEdge().tail;

                    return `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
                }
            }
        }
        return "";
    });
</script>

{#if pendingEdge()}
    <path
        d={path}
        class="stroke-primary [stroke-dasharray:0,24] [stroke-linecap:round] stroke-[12] fill-none"
    />
{/if}
