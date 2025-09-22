<script>
    import { Settings } from "@lucide/svelte";
    import {
        DATAVIEW,
        getCurrentView,
        getSidebarStatus,
        getSidebarToggler,
        getViewChanger,
        PIPEVIEW,
    } from "../../../context/SettingsContext.svelte";
    import { t } from "../../../i18n/i18n.svelte";
    import Button from "../../ui/Button/Button.svelte";
    import TabList from "../../ui/Tabs/TabList.svelte";
    import SettingsDialog from "../Settings/SettingsDialog.svelte";
    import Logo from "./Logo.svelte";
    import SidebarToggle from "./SidebarToggle.svelte";

    /** @type {import('svelte/elements').SvelteHTMLElements['header']} */
    let { ...props } = $props();
    let settingsDialogOpen = $state(false);

    const currentView = getCurrentView();
    const viewChanger = getViewChanger();
    let sidebarStatus = getSidebarStatus();
    let toggleSidebar = getSidebarToggler();
    const onOpenSettings = () => {
        if (sidebarStatus()) {
            toggleSidebar();
        }
        settingsDialogOpen = true;
    };
</script>

<header
    class={[
        "flex items-center justify-between p-2 border-b border-border/50 shrink-0",
        props.class,
    ]}
>
    <div class="flex items-center gap-2">
        <SidebarToggle />
        <Logo />
    </div>
    <div class="flex items-center gap-2">
        <TabList
            currentValue={currentView()}
            changer={viewChanger}
            tabs={[
                { value: PIPEVIEW, label: t("label.pipeline") },
                { value: DATAVIEW, label: t("label.data") },
            ]}
        />
        <Button variant="ghost" size="icon" onclick={onOpenSettings}>
            {#snippet tooltip()}
                <span class="text-xs font-normal">{t("label.settings")}</span>
            {/snippet}
            <Settings class="h-5 w-5" />
        </Button>
    </div>
</header>
<SettingsDialog bind:isOpen={settingsDialogOpen} />
