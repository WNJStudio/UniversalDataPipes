<script module>
    import { ElementRect } from "runed";
    import { clamp } from "../../../../utils/MathUtils";

    const ZOOM_SENSITIVITY = 0.001;
    const MIN_ZOOM = 0.001;
    const MAX_ZOOM = 20;

    /**
     * @type {number}
     */
    let lastZoomed = $state();

    export const getZoomed = () => () => lastZoomed;

    /**
     * @param {number} delta
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    const changeZoom = (delta, rect, transform) => {
        if (!rect) {
            return;
        }
        const newScale = clamp(transform.scale + delta, MIN_ZOOM, MAX_ZOOM);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const { x, y } = transform.canvasPosition(centerX, centerY);

        const newX = centerX / newScale - x;
        const newY = centerY / newScale - y;
        transform.x = newX;
        transform.y = newY;
        transform.scale = newScale;
        lastZoomed = Date.now();
    };

    /**
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    export const onZoomIn = (rect, transform) => {
        changeZoom(0.01, rect, transform);
    };
    /**
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    export const onZoomOut = (rect, transform) => {
        changeZoom(-0.01, rect, transform);
    };

    /**
     * @param {WheelEvent} e
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    const onWheel = (e, rect, transform) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (!rect) {
                return;
            }
            const delta = -e.deltaY * ZOOM_SENSITIVITY;
            const newScale = Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, transform.scale + delta),
            );

            const mouseX = e.clientX - rect.x;
            const mouseY = e.clientY - rect.y;
            const { x, y } = transform.canvasPosition(mouseX, mouseY);

            const newX = mouseX / newScale - x;
            const newY = mouseY / newScale - y;
            transform.x = newX;
            transform.y = newY;
            transform.scale = newScale;
            lastZoomed = Date.now();
        }
    };

    /**
     * @param {ElementRect} rect
     * @param {import('../../../../model/Transform.svelte').Transform} transform
     */
    export const attachWheel = (rect, transform) => {
        /**
         * @param {WheelEvent} e
         */
        const proxyOnWheel = (e) => onWheel(e, rect, transform);
        /**
         * @param {HTMLElement} el
         */
        const wheelAttachment = (el) => {
            el.addEventListener("wheel", proxyOnWheel, { passive: false });

            return () => {
                el.removeEventListener("wheel", proxyOnWheel);
            };
        };
        return wheelAttachment;
    };
</script>
