<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    const pipelineData = dataContext.get();

    const { edges } = pipelineContext.get();

    let errorMessage = $state("");

    /**
     * @type {import("@model/Edge.svelte").EdgeData[]}
     */
    let myInputEdges = $derived.by(() => {
        if (edges) {
            return Object.values(edges).filter(
                (edge) =>
                    inputs?.[0]?.id?.includes?.(edge.start) ||
                    inputs?.[0]?.id?.includes?.(edge.end),
            );
        }
        return [];
    });

    /**
     * @type {import("@model/Edge.svelte").EdgeData[]}
     */
    let myOutputEdges = $derived.by(() => {
        if (edges) {
            return Object.values(edges).filter(
                (edge) =>
                    outputs?.[0]?.id?.includes?.(edge.start) ||
                    outputs?.[0]?.id?.includes?.(edge.end),
            );
        }
        return [];
    });

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
