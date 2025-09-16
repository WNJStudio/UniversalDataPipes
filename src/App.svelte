<script>
    import { setContext } from "svelte";
    import AppHeader from "./components/app/AppHeader/AppHeader.svelte";
    import DataView from "./components/app/DataView/DataView.svelte";
    import PipelineView from "./components/app/PipelineView/PipelineView.svelte";
    import {
        PIPELINE_DATA,
        PIPELINE_DATA_CLEANER,
        PIPELINE_DATA_SETTER,
        PIPEVIEW,
    } from "./constants";
    import {
        createMenuContext,
        menus,
        mouseDownOutsideMenu,
    } from "./portals/MenuPortal.svelte";
    import {
        createTooltipContext,
        tooltips,
    } from "./portals/TooltipPortal.svelte";

    createTooltipContext();

    createMenuContext();

    /////////////////////////////
    ////   PIPILINE DATA     ////
    /////////////////////////////
    /**
     * @type {{[edgeId:string]:any}}
     */
    let pipelineData = $state({});
    /**
     * @param {string} edgeId
     * @param {any} data
     */
    const dataSetter = (edgeId, data) => {
        pipelineData[edgeId] = data;
    };
    /**
     * @param {string} edgeId
     */
    const dataCleaner = (edgeId) => {
        delete pipelineData[edgeId];
    };

    setContext(PIPELINE_DATA_SETTER, dataSetter);
    setContext(PIPELINE_DATA_CLEANER, dataCleaner);
    setContext(PIPELINE_DATA, pipelineData);

    // OTHER STUFF
    /** @type {PIPEVIEW|import('./constants').DATAVIEW}*/
    let currentView = $state(PIPEVIEW);

    let isSidebarOpen = $state(true);
</script>

<main class={["h-screen w-screen overflow-hidden bg-background"]}>
    <div class="flex flex-col h-full w-full">
        <AppHeader bind:currentView bind:isSidebarOpen />
        <div class="flex-1 relative flex overflow-hidden">
            <PipelineView {isSidebarOpen} hidden={currentView !== PIPEVIEW} />
            <DataView hidden={currentView === PIPEVIEW} />
        </div>
        {@render tooltips()}
        {@render menus()}
    </div>
</main>

<svelte:document onmousedown={mouseDownOutsideMenu} />
