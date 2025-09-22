<script>
    import { ZoomIn } from "@lucide/svelte";
    import { t } from "../../../../i18n/i18n.svelte";
    import Button from "../../../ui/Button/Button.svelte";

    /**
     * @typedef {Object} ZoomInButtonProps
     * @prop {()=>any} onZoomIn
     */
    /** @type {ZoomInButtonProps} */
    let { onZoomIn } = $props();
</script>

<Button tooltipSide="top" variant="ghost" size="icon" onclick={onZoomIn}>
    {#snippet tooltip()}
        <p class="text-xs">{t("label.zoomin.tooltip")}</p>
    {/snippet}
    <ZoomIn class="h-5 w-5" />
</Button>
