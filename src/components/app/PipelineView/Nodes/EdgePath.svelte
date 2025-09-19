<script>
    import { circInOut } from "svelte/easing";
    import { EdgeData } from "../../../../model/Edge.svelte";

    /**
     * @typedef {Object} EdgePathProps
     * @prop {EdgeData} edge
     * @prop {boolean} zoomed
     * @prop {boolean} moved
     * @prop {boolean} isSelected
     * @prop {(e:MouseEvent, id:string)=>any} onEdgeClick
     * @prop {import('../../../../model/Transform.svelte').Transform} canvasTransform
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

    /**
     * @param {SVGPathElement} node
     * @param {{delay?:number, duration?:number}} args
     * @returns {import('svelte/transition').TransitionConfig}
     */
    const snap = (node, { delay = 0, duration = 300 }) => {
        const totalLength = node.getTotalLength();
        return {
            delay,
            duration,
            css: (t, u) => {
                const dash = Math.min(
                    totalLength,
                    Math.max(0, (circInOut(t) * totalLength) / 2),
                );
                const dot = Math.min(
                    totalLength * 2,
                    Math.max(0, circInOut(u) * totalLength),
                );
                return `stroke-dasharray: ${dash} ${dot};`;
            },
        };
    };

    /**
     * @param {SVGPathElement} node
     * @param {{delay?:number, duration?:number, dot?:number}} args
     * @returns {import('svelte/transition').TransitionConfig}
     */
    const dashJoin = (node, { delay = 0, duration = 800, dot = 24 }) => {
        const totalLength = node.getTotalLength();
        return {
            delay,
            duration,
            css: (t, u) => {
                const dash = Math.min(
                    totalLength,
                    Math.max(0, (circInOut(t) * totalLength) / 2),
                );
                const dotp = Math.min(dot, Math.max(0, circInOut(u) * dot));
                return `stroke-dasharray:  ${dash} ${dotp};`;
            },
        };
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<path
    in:dashJoin={{}}
    out:snap={{}}
    onclick={(e) => onEdgeClick(e, edge.id)}
    data-edge-id={edge.id}
    id={edge.id}
    d={path}
    class={[
        "stroke-primary stroke-[12] [stroke-linecap:round] fill-none",
        "transition-[filter] duration-500 drop-shadow-2xl drop-shadow-black/50 brightness-100 hover:brightness-150",
        isSelected ? "brightness-125" : "",
    ]}
/>
