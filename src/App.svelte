<script>
    import AppHeader from "@app/AppHeader/AppHeader.svelte";
    import DataView from "@app/DataView/DataView.svelte";
    import PipelineView from "@app/PipelineView/PipelineView.svelte";
    import { t } from "@i18n/i18n.svelte";
    import MenuPortal from "@portal/MenuPortal.svelte";
    import TooltipPortal from "@portal/TooltipPortal.svelte";
</script>

<main class={["h-screen w-screen overflow-hidden bg-background"]}>
    <div class="flex flex-col h-full w-full">
        <AppHeader />
        <div class="flex-1 relative flex overflow-hidden">
            <PipelineView />
            <DataView />
        </div>
        <TooltipPortal />
        <MenuPortal />
    </div>
</main>

<svelte:head>
    <title>{t("label.app.name")}</title>
</svelte:head>
