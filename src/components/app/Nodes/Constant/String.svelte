<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import InputList from "@ui/Input/InputList.svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let node = $derived(pipeline.nodes[id]);

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    $effect(() => {
        if (outputEdges.length > 0) {
            if (node.config.strings?.length > 0) {
                outputEdges.forEach((edge) => {
                    pipelineData[edge.id] = node.config.strings;
                });
            } else {
                outputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });
</script>

<div class="flex-1 flex flex-col gap-2 min-h-14">
    <InputList
        bind:items={node.config.strings}
        listClass="flex-[1_1_0] min-h-14"
    />
</div>
