<script>
    import { PanelLeft, PanelRight } from "@lucide/svelte";
    import { PIPEVIEW, DATAVIEW } from "../../../constants";
    import Button from "../../ui/Button/Button.svelte";
    import SlideOut from "../../ui/Transitions/SlideOut.svelte";

    /**
     * @typedef {Object} SidebarToggleProps
     * @prop {PIPEVIEW|DATAVIEW} currentView
     * @prop {boolean} isSidebarOpen
     */
    /** @type {SidebarToggleProps} */
    let { currentView, isSidebarOpen = $bindable() } = $props();
    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };
</script>

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
            <span class="text-xs font-normal"
                >{isSidebarOpen
                    ? "Collapse Sidebar (CTRL + B)"
                    : "Expand Sidebar (CTRL + B)"}</span
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
