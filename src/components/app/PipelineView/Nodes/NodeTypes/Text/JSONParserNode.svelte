<script>
    import {
        getDataContext,
        getDataContextCleaner,
        getDataContextSetter,
    } from "../../../../../../context/DataContext.svelte";
    import { pipelineContext } from "../../../../../../context/PipelineContext.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    const dataSetter = getDataContextSetter();
    const dataCleaner = getDataContextCleaner();

    const pipelineData = getDataContext();

    const { edges } = pipelineContext.get();

    let errorMessage = $state("");

    /**
     * @type {import("../../../../../../model/Edge.svelte").EdgeData[]}
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
     * @type {import("../../../../../../model/Edge.svelte").EdgeData[]}
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
        if (myInputEdges.length > 0 && pipelineData()) {
            return myInputEdges.flatMap(
                (edge) => pipelineData()[edge.id] || [],
            );
        }
        return [];
    });

    $effect(() => {
        if (inputData.length > 0) {
            if (myOutputEdges.length > 0) {
                try {
                    const outputData = inputData.map((i) => JSON.parse(i));
                    myOutputEdges.forEach((edge) => {
                        dataSetter(edge.id, outputData);
                    });
                    errorMessage = "";
                } catch (error) {
                    errorMessage = `${error}`;
                }
            }
        } else {
            if (myOutputEdges.length > 0) {
                myOutputEdges.forEach((edge) => {
                    dataCleaner(edge.id);
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
        <p class="text-sm text-center text-muted-foreground">Connect input</p>
    {:else if myOutputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">Connect output</p>
    {:else if inputData.length === 0}
        <p class="text-sm text-center text-muted-foreground">No input data</p>
    {:else}
        <p class="text-sm text-center text-primary">
            Data processed successfully
        </p>
    {/if}
</div>
