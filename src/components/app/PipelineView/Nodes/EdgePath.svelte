<script>
    import { EdgeData } from "../../../../model/Edge.svelte";
    import { Transform } from "../../../../model/Pipeline.svelte";

    /**
     * @typedef {Object} EdgePathProps
     * @prop {EdgeData} edge
     * @prop {boolean} zoomed
     * @prop {boolean} moved
     * @prop {Transform} canvasTransform
     */
    /** @type {EdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let {
        edge,
        canvasTransform,
        zoomed = $bindable(),
        moved = $bindable(),
        ...props
    } = $props();
    const path = $derived.by(() => {
        if (moved || zoomed) {
        }
        const startHandle = document.querySelector(
            `[data-handle-id="${edge.start}"]`,
        );
        const endHandle = document.querySelector(
            `[data-handle-id="${edge.end}"]`,
        );
        if (startHandle && endHandle) {
            const canvasView = startHandle.closest('[data-canvas-view="true"]');
            if (canvasView) {
                const startRect = startHandle.getBoundingClientRect();
                const endRect = endHandle.getBoundingClientRect();
                const viewRect = canvasView.getBoundingClientRect();
                const startX =
                    (startRect.left + startRect.width / 2 - viewRect.left) /
                    canvasTransform.scale;
                const startY =
                    (startRect.top + startRect.height / 2 - viewRect.top) /
                    canvasTransform.scale;
                const endX =
                    (endRect.left + endRect.width / 2 - viewRect.left) /
                    canvasTransform.scale;
                const endY =
                    (endRect.top + endRect.height / 2 - viewRect.top) /
                    canvasTransform.scale;

                return `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
            }
        }
        return "";
    });
    $effect(() => {
        if (moved) {
            moved = false;
        }
        if (zoomed) {
            zoomed = false;
        }
    });
</script>

<path d={path} class="stroke-primary stroke-2 fill-none" />
