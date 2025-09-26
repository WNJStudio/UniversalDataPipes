<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let errorMessage = $state("");

    let myInputEdges = $derived(pipeline.getEdgesOfHandle(inputs?.[0]?.id));

    let myOutputEdges = $derived(pipeline.getEdgesOfHandle(outputs?.[0]?.id));

    /**
     * @type {string[]}
     */
    let inputData = $derived.by(() => {
        if (myInputEdges.length > 0 && pipelineData) {
            return myInputEdges.flatMap((edge) => pipelineData[edge.id] || []);
        }
        return [];
    });

    $effect(() => {
        if (inputData.length > 0) {
            if (myOutputEdges.length > 0) {
                try {
                    const outputData = inputData.map((i) => JSON.parse(i));
                    myOutputEdges.forEach((edge) => {
                        pipelineData[edge.id] = outputData;
                    });
                    errorMessage = "";
                } catch (error) {
                    errorMessage = `${error}`;
                }
            }
        } else {
            if (myOutputEdges.length > 0) {
                myOutputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });
</script>

<div
    class="text-left flex-1 flex flex-col justify-center items-center p-2 rounded-md"
>
    {#if errorMessage !== ""}
        <p class="text-sm text-center text-destructive">
            {errorMessage}
        </p>
    {:else if myInputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.jsonparser.connect.input")}
        </p>
    {:else if myOutputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.jsonparser.connect.output")}
        </p>
    {:else if inputData.length === 0}
        <p class="text-sm text-center text-muted-foreground">
            {t("label.node.jsonparser.nodata")}
        </p>
    {:else}
        <p class="text-sm text-center text-primary">
            {t("label.node.jsonparser.success")}
        </p>
    {/if}
</div>
