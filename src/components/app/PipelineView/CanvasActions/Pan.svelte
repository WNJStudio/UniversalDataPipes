<script module>
    import { Position } from "../../../../model/Position.svelte";
    /**
     * @type {number}
     */
    let lastPanned = $state();
    let panMode = $state(false);
    /**
     * @type {{origin:Position, canvas:Position}}
     */
    let panOrigin = $state();

    export const getPanned = () => () => lastPanned;
    export const getPanMode = () => () => panMode;
    export const togglePanMode = () => () => {
        panMode = !panMode;
    };
    export const getIsPanning = () => () => panMode || !!panOrigin;

    /**
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    export const attachPanAction = (transform) => {
        /**
         * @param {MouseEvent} e
         */
        const startPanning = (e) => {
            e.preventDefault();
            if (e.button === 1 || panMode) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                panOrigin = {
                    canvas: new Position(transform.x, transform.y),
                    origin: new Position(e.clientX, e.clientY),
                };
                lastPanned = Date.now();
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const panning = (e) => {
            if (panOrigin) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const delta = panOrigin.origin.delta(e.clientX, e.clientY);
                const { x, y } = transform.canvasPosition(
                    delta.x,
                    delta.y,
                    true,
                );
                transform.x = panOrigin.canvas.x + x;
                transform.y = panOrigin.canvas.y + y;
                lastPanned = Date.now();
            }
        };
        /**
         * @param {MouseEvent} e
         */
        const stopPanning = (e) => {
            if (panOrigin) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                panOrigin = undefined;
                lastPanned = Date.now();
            }
        };
        /**
         * @param {KeyboardEvent} e
         */
        const keyPressed = (e) => {
            if (e.key?.toLowerCase() === "p") {
                e.stopPropagation();
                e.stopImmediatePropagation();
                panMode = true;
            } else if (e.key?.toLowerCase() === "v") {
                e.stopPropagation();
                e.stopImmediatePropagation();
                panMode = false;
            }
        };
        /**
         * @param {HTMLElement} el
         */
        const panAttachment = (el) => {
            el.addEventListener("mousedown", startPanning);
            el.addEventListener("mousemove", panning);
            el.addEventListener("mouseup", stopPanning);
            el.addEventListener("keydown", keyPressed);

            return () => {
                el.removeEventListener("mousedown", startPanning);
                el.removeEventListener("mousemove", panning);
                el.removeEventListener("mouseup", stopPanning);
                el.removeEventListener("keydown", keyPressed);
            };
        };
        return panAttachment;
    };
</script>
