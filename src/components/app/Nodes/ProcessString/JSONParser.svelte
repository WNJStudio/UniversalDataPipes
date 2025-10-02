<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let node = $derived(pipeline.nodes[id]);

    let errorMessage = $state("");

    let inputEdges = $derived(pipeline.getEdgesOfHandle(node?.inputs?.[0]?.id));

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    /**
     * @type {string[]}
     */
    let inputData = $derived.by(() => {
        if (inputEdges.length > 0 && pipelineData) {
            return inputEdges.flatMap((edge) => pipelineData[edge.id] || []);
        }
        return [];
    });

    $effect(() => {
        if (inputData.length > 0) {
            if (outputEdges.length > 0) {
                try {
                    const outputData = inputData.map((i) => JSON.parse(i));
                    outputEdges.forEach((edge) => {
                        pipelineData[edge.id] = outputData;
                    });
                    errorMessage = "";
                } catch (error) {
                    errorMessage = `${error}`;
                }
            }
        } else {
            if (outputEdges.length > 0) {
                outputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });
</script>

<div
    class="text-left flex-[1_1_0] flex flex-col justify-center items-center p-2 rounded-md"
>
    {#if errorMessage !== ""}
        <p class="text-sm text-center text-destructive">
            {errorMessage}
        </p>
    {:else if inputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.connect.input")}
        </p>
    {:else if outputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.connect.output")}
        </p>
    {:else if inputData.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.nodata")}
        </p>
    {:else}
        <p class="text-sm text-center text-primary">
            {t("label.node.jsonparser.success")}
        </p>
    {/if}
</div>
