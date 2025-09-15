<script>
    import { Pipeline } from "../../../model/Pipeline.svelte";
    import ImportExportDialog from "./ImportExportDialog.svelte";
    import PipelineCanvas from "./PipelineCanvas.svelte";
    import PipelineSidebar from "./PipelineSidebar.svelte";
    import SavePipelineDialog from "./SavePipelineDialog.svelte";

    /**
     * @typedef {Object} PipelineViewProps
     * @prop {boolean} isSidebarOpen
     * @prop {boolean} hidden
     */
    /** @type {PipelineViewProps} */
    let { isSidebarOpen, hidden } = $props();
    let saveDialogOpen = $state(false);
    let savedPipelines = $state([]);
    let currentPipeline = $state(new Pipeline());
    let nodes = $state({});
    let edges = $state({});
    let saveName = $state();
    /**
     * @type {"import"|"export"}
     */
    let ieMode = $state();
    let ieDialogOpen = $state(false);
    let exportData = $state("");

    const onSave = (name) => {
        saveName = undefined;
        currentPipeline.name = name;
        currentPipeline.nodes = nodes;
        currentPipeline.edges = edges;
        savedPipelines = Pipeline.save(currentPipeline);
    };
    const onDelete = (name) => {
        savedPipelines = Pipeline.delete(name);
    };
    const onLoad = (pipe) => {
        currentPipeline = pipe;
        nodes = currentPipeline.reactiveNodes;
        edges = currentPipeline.reactiveEdges;
    };
    const onImportAll = () => {
        exportData = "";
        ieMode = "import";
        ieDialogOpen = true;
    };

    const onExportAll = () => {
        exportData = JSON.stringify(savedPipelines, null, 2);
        ieDialogOpen = true;
        ieMode = "export";
    };
    const onExportSingle = (name) => {
        exportData = JSON.stringify(Pipeline.cache[name], null, 2);
        ieDialogOpen = true;
        ieMode = "export";
    };

    const openSaveDialog = (name) => {
        if (name && name !== "") {
            saveName = name;
        } else {
            saveName = currentPipeline.name;
        }
        saveDialogOpen = true;
    };

    const checkName = (name) => {
        return Pipeline.hasPipe(name);
    };

    /**
     * @param {any} c
     * @returns {{success:number, failure:number}}
     */
    const handleOnImport = (c) => {
        const result = Pipeline.import(c);
        if (result.success > 0) {
            savedPipelines = Pipeline.load();
        }
        return result;
    };

    const cleanUpIE = () => {
        ieMode = null;
        ieDialogOpen = false;
        exportData = "";
    };

    $effect(() => {
        savedPipelines = Pipeline.load();
    });
</script>

<PipelineSidebar
    hidden={!isSidebarOpen || hidden}
    {savedPipelines}
    onSave={openSaveDialog}
    {onDelete}
    {onLoad}
    {onExportAll}
    {onImportAll}
    {onExportSingle}
/>
<PipelineCanvas {hidden} bind:edges bind:nodes />
<SavePipelineDialog
    bind:isOpen={saveDialogOpen}
    name={saveName}
    {checkName}
    {onSave}
/>
<ImportExportDialog
    data={exportData}
    bind:isOpen={ieDialogOpen}
    mode={ieMode}
    onImport={handleOnImport}
    onClose={cleanUpIE}
/>
