<script>
    import { dataContext } from "../../../context/DataContext.svelte";
    import { pipelineContext } from "../../../context/PipelineContext.svelte";
    import { Pipeline, pipelineStorage } from "../../../model/Pipeline.svelte";
    import ImportExportDialog from "./ImportExportDialog.svelte";
    import PipelineCanvas from "./PipelineCanvas.svelte";
    import SavePipelineDialog from "./SavePipelineDialog.svelte";
    import PipelineSidebar from "./Sidebar/PipelineSidebar.svelte";

    let pipeline = $state(new Pipeline());
    pipelineContext.set(pipeline);
    let data = $state({});
    dataContext.set(data);

    /**
     * @type {{open: boolean, name: string}}
     */
    let saveDialogState = $state({
        open: false,
        name: undefined,
    });
    /**
     * @type {{open: boolean, mode: "import"|"export", data: string}}
     */
    let ieDialogState = $state({
        open: false,
        mode: undefined,
        data: "",
    });
    const onSave = (name) => {
        saveDialogState.name = undefined;
        pipeline.name = name;
        pipeline.setSavedAt(new Date().toISOString());

        pipelineStorage.current[pipeline.name] = pipeline.toJSON();
    };

    const onImportAll = () => {
        ieDialogState.data = "";
        ieDialogState.mode = "import";
        ieDialogState.open = true;
    };

    const onExportAll = () => {
        ieDialogState.data = JSON.stringify(Pipeline.load(), null, 2);
        ieDialogState.mode = "export";
        ieDialogState.open = true;
    };
    const onExportSingle = (name) => {
        ieDialogState.data = JSON.stringify(
            pipelineStorage.current[name],
            null,
            2,
        );
        ieDialogState.mode = "export";
        ieDialogState.open = true;
    };

    const openSaveDialog = (name) => {
        if (name && name !== "") {
            saveDialogState.name = name;
        } else {
            saveDialogState.name = pipeline.name;
        }
        saveDialogState.open = true;
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
        ieDialogState.data = "";
        ieDialogState.mode = undefined;
        ieDialogState.open = false;
    };
</script>

<PipelineSidebar
    onSave={openSaveDialog}
    {onExportAll}
    {onImportAll}
    {onExportSingle}
/>
<PipelineCanvas />
<SavePipelineDialog
    bind:isOpen={saveDialogState.open}
    name={saveDialogState.name}
    {checkName}
    {onSave}
/>
<ImportExportDialog
    data={ieDialogState.data}
    bind:isOpen={ieDialogState.open}
    mode={ieDialogState.mode}
    onImport={handleOnImport}
    onClose={cleanUpIE}
/>
