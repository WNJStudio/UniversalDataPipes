<script>
    import { circInOut } from "svelte/easing";
    import { EdgeData } from "../../../../model/Edge.svelte";
    import { clamp } from "../../../../utils/MathUtils";
    import { ElementRect } from "runed";
    import { getZoomed } from "../CanvasActions/Zoom.svelte";
    import { getPanned } from "../CanvasActions/Pan.svelte";
    import {
        getEdgeSelectionChecker,
        onEdgeClick,
    } from "../CanvasActions/Select.svelte";
    import { getDragged } from "../CanvasActions/Drag.svelte";
    import { getLoaded } from "../../../../model/Pipeline.svelte";

    /**
     * @typedef {Object} EdgePathProps
     * @prop {EdgeData} edge
     * @prop {import('../../../../model/Transform.svelte').Transform} canvasTransform
     * @prop {ElementRect} canvasViewRect
     */
    /** @type {EdgePathProps & import('svelte/elements').SvelteHTMLElements['path']} */
    let { edge, canvasTransform, canvasViewRect, ...props } = $props();
    const lastZoomed = getZoomed();
    const lastPanned = getPanned();
    const lastDragged = getDragged();
    const lastLoaded = getLoaded();
    const checker = getEdgeSelectionChecker();
    const isSelected = () => checker([edge.id]);
    let lastUpdated = $state(Date.now());
    /**
     * @type {DOMRect}
     */
    let startRect = $state();
    /**
     * @type {DOMRect}
     */
    let endRect = $state();

    const path = $derived.by(() => {
        if (canvasViewRect && startRect && endRect) {
            let startX =
                (startRect.left + startRect.width / 2 - canvasViewRect.left) /
                canvasTransform.scale;
            let startY =
                (startRect.top + startRect.height / 2 - canvasViewRect.top) /
                canvasTransform.scale;
            let endX =
                (endRect.left + endRect.width / 2 - canvasViewRect.left) /
                canvasTransform.scale;
            let endY =
                (endRect.top + endRect.height / 2 - canvasViewRect.top) /
                canvasTransform.scale;
            if (startX > endX) {
                [endX, startX] = [startX, endX];
                [endY, startY] = [startY, endY];
            }
            // TODO: should thing of more extreme cases and make the curve look better
            return `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
        }
        return "";
    });
    $effect(() => {
        if (
            !startRect ||
            !endRect ||
            lastPanned() > lastUpdated ||
            lastZoomed() > lastUpdated ||
            lastDragged() > lastUpdated ||
            lastLoaded() > lastUpdated
        ) {
            const startHandle = document.querySelector(
                `[data-handle-id="${edge.start}"]`,
            );
            const endHandle = document.querySelector(
                `[data-handle-id="${edge.end}"]`,
            );
            if (startHandle && endHandle) {
                startRect = startHandle.getBoundingClientRect();
                endRect = endHandle.getBoundingClientRect();
            }
            lastUpdated = Date.now();
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
                const dash = clamp(
                    (circInOut(t) * totalLength) / 2,
                    0,
                    totalLength,
                );
                const dot = clamp(
                    circInOut(u) * totalLength,
                    0,
                    totalLength * 2,
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
                const dash = clamp(
                    (circInOut(t) * totalLength) / 2,
                    0,
                    totalLength,
                );

                const dotp = clamp(circInOut(u) * dot, 0, dot);
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
        isSelected() ? "brightness-125" : "",
    ]}
/>
