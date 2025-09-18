<script>
    import {
        getEdgeData,
        getEdgeDataSetter,
    } from "../../../context/EdgeContext.svelte";
    import { Pipeline, pipelineStorage } from "../../../model/Pipeline.svelte";
    import ImportExportDialog from "./ImportExportDialog.svelte";
    import PipelineCanvas from "./PipelineCanvas.svelte";
    import SavePipelineDialog from "./SavePipelineDialog.svelte";
    import PipelineSidebar from "./Sidebar/PipelineSidebar.svelte";

    const edgeSetter = getEdgeDataSetter();
    const edges = getEdgeData();

    let saveDialogOpen = $state(false);
    let currentPipeline = $state(new Pipeline());
    let nodes = $state({});
    let saveName = $state();
    let pipeChanged = $state(false);

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
        currentPipeline.edges = edges();
        currentPipeline.savedAt = new Date().toISOString();
        pipelineStorage.current[currentPipeline.name] = currentPipeline;
    };
    const onDelete = (name) => {
        pipelineStorage.current[name] = undefined;
    };
    const onLoad = (pipe) => {
        currentPipeline = pipe;
        nodes = currentPipeline.reactiveNodes;
        edgeSetter(currentPipeline.reactiveEdges);
        pipeChanged = true;
    };
    const onImportAll = () => {
        exportData = "";
        ieMode = "import";
        ieDialogOpen = true;
    };

    const onExportAll = () => {
        exportData = JSON.stringify(
            Object.values(pipelineStorage.current),
            null,
            2,
        );
        ieDialogOpen = true;
        ieMode = "export";
    };
    const onExportSingle = (name) => {
        exportData = JSON.stringify(pipelineStorage.current[name], null, 2);
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
        if (!name || name === "") {
            return false;
        }
        return pipelineStorage.current[name] ? true : false;
    };

    /**
     * @param {any} c
     * @returns {{success:number, failure:number}}
     */
    const handleOnImport = (c) => Pipeline.import(c);

    const cleanUpIE = () => {
        ieMode = null;
        ieDialogOpen = false;
        exportData = "";
    };
</script>

<PipelineSidebar
    onSave={openSaveDialog}
    {onDelete}
    {onLoad}
    {onExportAll}
    {onImportAll}
    {onExportSingle}
/>
<PipelineCanvas bind:nodes bind:pipeChanged />
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
