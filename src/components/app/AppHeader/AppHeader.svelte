<script>
    import TabList from "../../ui/Tabs/TabList.svelte";
    import Logo from "./Logo.svelte";
    import SidebarToggle from "./SidebarToggle.svelte";
    import {
        PIPEVIEW,
        DATAVIEW,
    } from "../../../context/SettingsContext.svelte";

    /** @type {import('svelte/elements').SvelteHTMLElements['header']} */
    let { ...props } = $props();
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
    <TabList
        tabs={[
            { value: PIPEVIEW, label: "Pipeline" },
            { value: DATAVIEW, label: "Data" },
        ]}
    />
</header>
