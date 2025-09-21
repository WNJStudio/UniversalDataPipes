<script>
    import { Rectangle } from "../../../model/Rectangle.svelte";
    import { getSelectionRectangle } from "./CanvasActions/Select.svelte";

    const rect = getSelectionRectangle();
</script>

{#if rect()}
    {@const r = rect()}
    <div
        class={[
            "absolute border-2 border-dashed border-primary bg-primary/20 pointer-events-none",
        ]}
        style={`left: ${r.x}px; top: ${r.y}px; width: ${r.width}px; height: ${r.height}px`}
    ></div>
{/if}
