<script>
    import { PanelLeft, PanelRight, Workflow } from "@lucide/svelte";
    import { DATAVIEW, PIPEVIEW } from "../../../constants";
    import Button from "../../ui/Button/Button.svelte";
    import TabList from "../../ui/Tabs/TabList.svelte";
    import SlideOut from "../../ui/Transitions/SlideOut.svelte";

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

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };
</script>

<header
    class={[
        "flex items-center justify-between p-2 border-b border-border/50 shrink-0",
        props.class,
    ]}
>
    <div class="flex items-center gap-2">
        <SlideOut hidden={currentView !== PIPEVIEW} delay={300}>
            <Button
                tooltipSide="bottom"
                variant="ghost"
                size="icon"
                toggle
                toggleStatus={isSidebarOpen}
                onclick={toggleSidebar}
                class="h-8 w-8"
            >
                {#snippet tooltip()}
                    {isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                {/snippet}
                {#snippet toggleOn()}
                    <PanelLeft class="h-5 w-5" />
                {/snippet}
                {#snippet toggleOff()}
                    <PanelRight class="h-5 w-5" />
                {/snippet}
            </Button>
        </SlideOut>
        <Workflow class="h-6 w-6 text-primary" />
        <h1 class="text-xl font-bold text-foreground select-none">
            Universal Data Pipes
        </h1>
    </div>
    <TabList
        bind:currentView
        tabs={[
            { value: PIPEVIEW, label: "Pipeline" },
            { value: DATAVIEW, label: "Data" },
        ]}
    />
</header>
