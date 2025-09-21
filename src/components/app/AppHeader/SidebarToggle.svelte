<script>
    import { PanelLeft, PanelRight } from "@lucide/svelte";
    import Button from "../../ui/Button/Button.svelte";
    import SlideOut from "../../ui/Transitions/SlideOut.svelte";

    import {
        getSidebarToggler,
        getSidebarStatus,
        getCurrentView,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import { t } from "../../../i18n/i18n.svelte";
    const sidebarToggler = getSidebarToggler();
    const sidebarStatus = getSidebarStatus();
    const currentView = getCurrentView();
</script>

<SlideOut hidden={currentView() !== PIPEVIEW} delay={300}>
    <Button
        tooltipSide="bottom"
        variant="ghost"
        size="icon"
        toggle
        toggleStatus={sidebarStatus()}
        onclick={() => sidebarToggler()}
        class="h-8 w-8"
    >
        {#snippet tooltip()}
            <span class="text-xs font-normal"
                >{sidebarStatus()
                    ? t("label.sidebar.collapse")
                    : t("label.sidebar.expand")}</span
            >
        {/snippet}
        {#snippet toggleOn()}
            <PanelLeft class="h-5 w-5" />
        {/snippet}
        {#snippet toggleOff()}
            <PanelRight class="h-5 w-5" />
        {/snippet}
    </Button>
</SlideOut>
