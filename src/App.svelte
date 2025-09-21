<script>
    import AppHeader from "./components/app/AppHeader/AppHeader.svelte";
    import DataView from "./components/app/DataView/DataView.svelte";
    import PipelineView from "./components/app/PipelineView/PipelineView.svelte";
    import { getLanguage } from "./context/SettingsContext.svelte";
    import { t } from "./i18n/i18n.svelte";
    import { menus } from "./portals/MenuPortal.svelte";
    import { tooltips } from "./portals/TooltipPortal.svelte";
</script>

<main class={["h-screen w-screen overflow-hidden bg-background"]}>
    <div class="flex flex-col h-full w-full">
        <AppHeader />
        <div class="flex-1 relative flex overflow-hidden">
            <PipelineView />
            <DataView />
        </div>
        {@render tooltips()}
        {@render menus()}
    </div>
</main>

<svelte:head>
    <title>{t("label.app.name")}</title>
</svelte:head>
