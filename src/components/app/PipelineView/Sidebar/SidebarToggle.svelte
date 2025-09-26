<script>
    import { PanelLeft, PanelRight } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";

    import {
        getCurrentView,
        getSidebarStatus,
        getSidebarToggler,
        PIPEVIEW,
    } from "@context/SettingsContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { fly } from "svelte/transition";
    const sidebarToggler = getSidebarToggler();
    const sidebarStatus = getSidebarStatus();
    const currentView = getCurrentView();
</script>

{#if currentView() === PIPEVIEW}
    <div
        transition:fly={{ x: "-100%" }}
        class={[
            "absolute z-50 top-2 left-2 transition-[translate,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke]",
            sidebarStatus() ? "translate-x-64" : "",
        ]}
    >
        <Button
            tooltipSide="bottom"
            size="icon"
            variant="floating"
            toggle
            toggleStatus={sidebarStatus()}
            delay={500}
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
    </div>
{/if}
