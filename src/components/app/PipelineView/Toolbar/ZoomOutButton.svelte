<script>
    import { ZoomOut } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";

    /**
     * @typedef {Object} ZoomOutButtonProps
     * @prop {()=>any} onZoomOut
     */
    /** @type {ZoomOutButtonProps } */
    let { onZoomOut } = $props();
</script>

<Button tooltipSide="top" variant="ghost" size="icon" onclick={onZoomOut}>
    {#snippet tooltip()}
        <p class="text-xs">Zoom Out (CRTL + Scroll Down)</p>
    {/snippet}
    <ZoomOut class="h-5 w-5" />
</Button>
