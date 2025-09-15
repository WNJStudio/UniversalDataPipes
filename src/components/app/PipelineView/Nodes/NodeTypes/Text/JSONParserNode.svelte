<script>
    import { getContext } from "svelte";
    import {
        PIPELINE_DATA,
        PIPELINE_DATA_SETTER,
        PIPELINE_EDGES,
    } from "../../../../../../constants";
    import { EdgeData } from "../../../../../../model/Edge.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    /**
     * @type {(edgeId:string,data:any)=>any}
     */
    const dataSetter = getContext(PIPELINE_DATA_SETTER);
    /**
     * @type {{[edgeId:string]:any}}
     */
    const pipelineData = getContext(PIPELINE_DATA);
    /**
     * @type {{[edgeId:string]:EdgeData}}
     */
    const edges = getContext(PIPELINE_EDGES);

    let errorMessage = $state("");

    /**
     * @type {EdgeData[]}
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
     * @type {EdgeData[]}
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
                        dataSetter?.(edge.id, outputData);
                    });
                    errorMessage = "";
                } catch (error) {
                    errorMessage = `${error}`;
                }
            }
        }
    });
</script>

<div class="text-left p-2 rounded-md">
    {#if errorMessage !== ""}
        <p class="text-sm text-center text-destructive">
            {errorMessage}
        </p>
    {:else if myInputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">Connect input</p>
    {:else if myOutputEdges.length === 0}
        <p class="text-sm text-center text-muted-foreground">Connect output</p>
    {:else}
        <p class="text-sm text-center text-muted-foreground">
            Data processed successfully
        </p>
    {/if}
</div>
