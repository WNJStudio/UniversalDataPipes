<script>
    import { setContext } from "svelte";
    import AppHeader from "./components/app/AppHeader/AppHeader.svelte";
    import DataView from "./components/app/DataView/DataView.svelte";
    import PipelineView from "./components/app/PipelineView/PipelineView.svelte";
    import {
        MENU_DISPLAY,
        MENU_PORTAL_SUBSCRIBE,
        MENU_PORTAL_UNSUBSCRIBE,
        PIPELINE_DATA,
        PIPELINE_DATA_CLEANER,
        PIPELINE_DATA_SETTER,
        PIPEVIEW,
    } from "./constants";
    import {
        createTooltipContext,
        tooltips,
    } from "./portals/TooltipPortal.svelte";

    createTooltipContext();

    /////////////////////////////
    ////        MENUS        ////
    /////////////////////////////
    /**
     * @type {{[x:string]:import('svelte').Snippet<[{hidden:boolean, x?:number, y?:number}]>}}
     */
    let menuPortal = $state({});
    /**
     * @type {{name?:string, x?:number, y?:number}}
     */
    let showMenu = $state({});

    /**
     * @param {string} name
     * @param {import('svelte').Snippet<[{hidden:boolean, x?:number, y?:number}]>} renderer
     */
    const addMenu = (name, renderer) => {
        menuPortal[name] = renderer;
    };

    /**
     * @param {string} name
     */
    const removeMenu = (name) => {
        delete menuPortal[name];
    };

    /**
     *
     * @param {string} name
     * @param {number} [x]
     * @param {number} [y]
     */
    const displayMenu = (name, x, y) => {
        showMenu = { name, x, y };
    };

    setContext(MENU_PORTAL_SUBSCRIBE, addMenu);
    setContext(MENU_PORTAL_UNSUBSCRIBE, removeMenu);
    setContext(MENU_DISPLAY, displayMenu);

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

    // General mouse down
    /**
     * @param {MouseEvent} e
     */
    const handleDocumentMouseDown = (e) => {
        if (!showMenu.name) {
            return;
        }
        if (e.target instanceof HTMLElement) {
            if (e.target.closest("[data-menu]")) {
                return;
            }
            showMenu = {};
        }
    };

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
        {#each Object.entries(menuPortal) as [name, menu] (name)}
            {@render menu({
                hidden: name === showMenu.name,
                x: showMenu.x,
                y: showMenu.y,
            })}
        {/each}
    </div>
</main>

<svelte:document onmousedown={handleDocumentMouseDown} />
