<script>
    import { Pipeline } from "../../../model/Pipeline.svelte";
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
/>
<PipelineCanvas {hidden} bind:edges bind:nodes />
<SavePipelineDialog
    bind:isOpen={saveDialogOpen}
    name={saveName}
    {checkName}
    {onSave}
/>
