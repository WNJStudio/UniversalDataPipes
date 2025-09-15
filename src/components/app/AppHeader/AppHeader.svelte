<script>
    import { DATAVIEW, PIPEVIEW } from "../../../constants";
    import TabList from "../../ui/Tabs/TabList.svelte";
    import Logo from "./Logo.svelte";
    import SidebarToggle from "./SidebarToggle.svelte";

    /**
     * @typedef {Object} AppHeaderProps
     * @prop {PIPEVIEW|DATAVIEW} currentView
     * @prop {boolean} isSidebarOpen
     */
    /** @type {AppHeaderProps & import('svelte/elements').SvelteHTMLElements['header']} */
    let {
        currentView = $bindable(),
        isSidebarOpen = $bindable(),
        ...props
    } = $props();
</script>

<header
    class={[
        "flex items-center justify-between p-2 border-b border-border/50 shrink-0",
        props.class,
    ]}
>
    <div class="flex items-center gap-2">
        <SidebarToggle {currentView} bind:isSidebarOpen />
        <Logo />
    </div>
    <TabList
        bind:currentView
        tabs={[
            { value: PIPEVIEW, label: "Pipeline" },
            { value: DATAVIEW, label: "Data" },
        ]}
    />
</header>
