<script>
    import { setContext } from "svelte";
    import AppHeader from "./components/app/AppHeader/AppHeader.svelte";
    import DataView from "./components/app/DataView/DataView.svelte";
    import PipelineView from "./components/app/PipelineView/PipelineView.svelte";
    import { PIPEVIEW } from "./constants";

    /** @type {PIPEVIEW|import('./constants').DATAVIEW}*/
    let currentView = $state(PIPEVIEW);

    let isSidebarOpen = $state(true);
    /////////////////////////////
    ////      TOOLTIP        ////
    /////////////////////////////
    /**
     * @type {{[x:string]:import('svelte').Snippet<[{hidden:boolean}]>}}
     */
    let tooltipPortal = $state({});
    let showtip = $state();

    /**
     * @param {string} id
     * @param {import('svelte').Snippet<[{hidden:boolean}]>} renderer
     */
    const addTooltip = (id, renderer) => {
        tooltipPortal[id] = renderer;
    };

    /**
     * @param {string} id
     */
    const removeTooltip = (id) => {
        delete tooltipPortal[id];
    };

    setContext("tooltip_portal_subscribe", addTooltip);
    setContext("tooltip_portal_unsubscribe", removeTooltip);
    setContext("tooltip_display", (t) => (showtip = t));

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

    setContext("menu_portal_subscribe", addMenu);
    setContext("menu_portal_unsubscribe", removeMenu);
    setContext("menu_display", displayMenu);

    /////////////////////////////
    ////   PIPILINE DATA     ////
    /////////////////////////////
    /**
     * @type {{[handleId:string]:any}}
     */
    let pipelineData = $state({});
    /**
     * @param {string} handleId
     * @param {any} data
     */
    const dataSetter = (handleId, data) => {
        pipelineData[handleId] = data;
    };
    /**
     * @param {string} handleId
     */
    const dataGetter = (handleId) => {
        return pipelineData[handleId];
    };

    setContext("pipeline_data_setter", dataSetter);
    setContext("pipeline_data_getter", dataGetter);

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
</script>

<main class={["h-screen w-screen overflow-hidden bg-background"]}>
    <div class="flex flex-col h-full w-full">
        <AppHeader bind:currentView bind:isSidebarOpen />
        <div class="flex-1 relative flex overflow-hidden">
            <PipelineView {isSidebarOpen} hidden={currentView !== PIPEVIEW} />
            <DataView hidden={currentView === PIPEVIEW} />
        </div>
        {#each Object.entries(tooltipPortal) as [id, tooltip] (id)}
            {@render tooltip({ hidden: id === showtip })}
        {/each}
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
