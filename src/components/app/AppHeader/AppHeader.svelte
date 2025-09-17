<script>
    import TabList from "../../ui/Tabs/TabList.svelte";
    import Logo from "./Logo.svelte";
    import SidebarToggle from "./SidebarToggle.svelte";
    import {
        PIPEVIEW,
        DATAVIEW,
    } from "../../../context/SettingsContext.svelte";
    import Button from "../../ui/Button/Button.svelte";
    import { Settings } from "@lucide/svelte";
    import SettingsDialog from "../SettingsDialog.svelte";

    /** @type {import('svelte/elements').SvelteHTMLElements['header']} */
    let { ...props } = $props();
    let settingsDialogOpen = $state(false);
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
            tabs={[
                { value: PIPEVIEW, label: "Pipeline" },
                { value: DATAVIEW, label: "Data" },
            ]}
        />
        <Button
            variant="ghost"
            size="icon"
            onclick={() => (settingsDialogOpen = true)}
        >
            {#snippet tooltip()}
                <span class="text-xs font-normal">Settings</span>
            {/snippet}
            <Settings class="h-5 w-5" />
        </Button>
    </div>
</header>
<SettingsDialog bind:isOpen={settingsDialogOpen} />
