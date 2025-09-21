<script>
    import { Hand, MousePointer } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import { getPanMode, togglePanMode } from "../CanvasActions/Pan.svelte";

    const panMode = getPanMode();
    const toggle = togglePanMode();
</script>

<Button tooltipSide="top" variant="ghost" size="icon" onclick={toggle}>
    {#snippet tooltip()}
        <p class="text-xs">
            {panMode() ? "Pan Mode (P)" : "Select Mode (V)"}
        </p>
    {/snippet}
    {#if panMode()}
        <Hand class="h-5 w-5" />
    {:else}
        <MousePointer class="h-5 w-5" />
    {/if}
</Button>
