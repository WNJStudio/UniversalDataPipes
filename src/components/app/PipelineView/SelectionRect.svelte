<script>
    import { Rectangle } from "../../../model/Rectangle.svelte";

    /**
     * @typedef {Object} SelectionRectProps
     * @prop {Rectangle} rect
     */
    /** @type {SelectionRectProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { rect, ...props } = $props();
</script>

<div
    class={[
        "absolute border-2 border-dashed border-primary bg-primary/20 pointer-events-none",
        props.class,
    ]}
    style={`left: ${rect.x}px; top: ${rect.y}px; width: ${rect.width}px; height: ${rect.height}px`}
></div>
