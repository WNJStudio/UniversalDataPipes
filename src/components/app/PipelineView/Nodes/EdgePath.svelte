<script>
    import { EdgeData } from "../../../../model/Edge.svelte";
    import { Transform } from "../../../../model/Pipeline.svelte";

    /**
     * @typedef {Object} EdgePathProps
     * @prop {EdgeData} edge
     * @prop {boolean} zoomed
     * @prop {boolean} moved
     * @prop {boolean} isSelected
     * @prop {(e:MouseEvent, id:string)=>any} onEdgeClick
     * @prop {Transform} canvasTransform
     * @prop {HTMLElement} canvasView
     */
    /** @type {EdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let {
        edge,
        canvasTransform,
        canvasView,
        zoomed = $bindable(),
        moved = $bindable(),
        onEdgeClick,
        isSelected = false,
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
            if (canvasView) {
                const startRect = startHandle.getBoundingClientRect();
                const endRect = endHandle.getBoundingClientRect();
                const viewRect = canvasView.getBoundingClientRect();
                let startX =
                    (startRect.left + startRect.width / 2 - viewRect.left) /
                    canvasTransform.scale;
                let startY =
                    (startRect.top + startRect.height / 2 - viewRect.top) /
                    canvasTransform.scale;
                let endX =
                    (endRect.left + endRect.width / 2 - viewRect.left) /
                    canvasTransform.scale;
                let endY =
                    (endRect.top + endRect.height / 2 - viewRect.top) /
                    canvasTransform.scale;
                if (startX > endX) {
                    [endX, startX] = [startX, endX];
                    [endY, startY] = [startY, endY];
                }
                // TODO: should thing of more extreme cases and make the curve look better
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<path
    onclick={(e) => onEdgeClick(e, edge.id)}
    data-edge-id={edge.id}
    id={edge.id}
    d={path}
    class={[
        "stroke-primary/50 stroke-[12] [stroke-linecap:round] fill-none",
        "transition-[filter] hover:brightness-150",
        isSelected ? "brightness-125" : "",
    ]}
/>
