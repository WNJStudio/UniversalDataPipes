<script module>
    import { cubicOut } from "svelte/easing";

    /**
     * @typedef {Object} SmoothScaleParams
     * @prop {number} [duration] default 300
     * @prop {number} [delay] default 0
     * @prop {boolean} [min] default false
     * @prop {"width"|"height"|"both"} [axis] default both
     * @prop {(n:number)=>number} [easing] default cubicOut
     */

    /**
     * @param {Element} el
     * @param {SmoothScaleParams} param
     * @returns {import('svelte/transition').TransitionConfig}
     */
    export const smoothScale = (
        el,
        {
            delay = 0,
            duration = 300,
            axis = "both",
            easing = cubicOut,
            min = false,
        },
    ) => {
        const { height, width } = el.getBoundingClientRect();
        const { paddingTop, paddingBottom, paddingLeft, paddingRight } =
            window.getComputedStyle(el);
        return {
            delay,
            duration,
            css: (t, u) => {
                const iv = easing(t);
                const pt = iv * parseFloat(paddingTop);
                const pb = iv * parseFloat(paddingBottom);
                const pl = iv * parseFloat(paddingLeft);
                const pr = iv * parseFloat(paddingRight);
                const h = iv * height;
                const w = iv * width;

                return `
                ${
                    axis === "width"
                        ? ""
                        : `padding-top: ${pt}px;
                           padding-bottom: ${pb}px;
                           ${min ? "min-" : ""}height: ${h}px;`
                }
                ${
                    axis === "height"
                        ? ""
                        : `padding-left: ${pl}px;
                           padding-right: ${pr}px;
                           ${min ? "min-" : ""}width: ${w}px;`
                }
                    opacity: ${iv};
                    overflow: hidden;
                `;
            },
        };
    };
</script>
