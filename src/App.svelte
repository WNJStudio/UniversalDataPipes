<script>
    import { setContext } from "svelte";
    import AppHeader from "./components/app/AppHeader/AppHeader.svelte";
    import DataView from "./components/app/DataView/DataView.svelte";
    import PipelineView from "./components/app/PipelineView/PipelineView.svelte";
    import { PIPEVIEW } from "./constants";

    /** @type {PIPEVIEW|import('./constants').DATAVIEW}*/
    let currentView = $state(PIPEVIEW);

    let isSidebarOpen = $state(true);
    /**
     * @type {{[x:string]:import('svelte').Snippet<[{hidden:boolean}]>}}
     */
    let portal = $state({});
    let showtip = $state();
    let pipelineData = $state({});

    /**
     * @param {string} id
     * @param {import('svelte').Snippet<[{hidden:boolean}]>} renderer
     */
    const addTooltip = (id, renderer) => {
        portal[id] = renderer;
    };

    /**
     * @param {string} id
     */
    const removeTooltip = (id) => {
        delete portal[id];
    };

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

    setContext("SubscribePortal", addTooltip);
    setContext("UnsubscribePortal", removeTooltip);
    setContext("ShowTip", (t) => (showtip = t));
    setContext("pipeline_data_setter", dataSetter);
    setContext("pipeline_data_getter", dataGetter);
</script>

<main class="h-screen w-screen overflow-hidden bg-background">
    <div class="flex flex-col h-full w-full">
        <AppHeader bind:currentView bind:isSidebarOpen />
        <div class="flex-1 relative flex overflow-hidden">
            <PipelineView {isSidebarOpen} hidden={currentView !== PIPEVIEW} />
            <DataView hidden={currentView === PIPEVIEW} />
        </div>
        {#each Object.entries(portal) as [id, tooltip] (id)}
            {@render tooltip({ hidden: id === showtip })}
        {/each}
    </div>
</main>
