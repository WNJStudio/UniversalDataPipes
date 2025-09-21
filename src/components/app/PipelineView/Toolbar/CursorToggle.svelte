<script>
    import { Hand, MousePointer } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import { getPanMode, togglePanMode } from "../CanvasActions/Pan.svelte";
    import { t } from "../../../../i18n/i18n.svelte";

    const panMode = getPanMode();
    const toggle = togglePanMode();
</script>

<Button tooltipSide="top" variant="ghost" size="icon" onclick={toggle}>
    {#snippet tooltip()}
        <p class="text-xs">
            {panMode()
                ? t("label.toolbar.panmode")
                : t("label.toolbar.selectmode")}
        </p>
    {/snippet}
    {#if panMode()}
        <Hand class="h-5 w-5" />
    {:else}
        <MousePointer class="h-5 w-5" />
    {/if}
</Button>
