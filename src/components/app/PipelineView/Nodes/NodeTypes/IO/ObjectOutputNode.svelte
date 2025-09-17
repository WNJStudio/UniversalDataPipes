<script>
    import { RefreshCw } from "@lucide/svelte";
    import { getDataContext } from "../../../../../../context/DataContext.svelte";
    import { getEdgeData } from "../../../../../../context/EdgeContext.svelte";
    import { EdgeData } from "../../../../../../model/Edge.svelte";
    import Button from "../../../../../ui/Button/Button.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    const pipelineData = getDataContext();

    const edges = getEdgeData();

    /**
     * @type {EdgeData[]}
     */
    let myEdges = $derived.by(() => {
        if (edges()) {
            return Object.values(edges()).filter(
                (edge) =>
                    inputs?.[0]?.id?.includes?.(edge.start) ||
                    inputs?.[0]?.id?.includes?.(edge.end),
            );
        }
        return [];
    });

    /**
     * @type {any[]}
     */
    let data = $derived.by(() => {
        if (myEdges.length > 0 && pipelineData()) {
            return myEdges.flatMap((edge) => pipelineData()[edge.id] || []);
        }
        return [];
    });

    let randomIndex = $state(0);

    let preview = $derived(data?.[randomIndex]);

    const selectRandom = () => {
        if (data && data.length > 0) {
            randomIndex = ~~(Math.random() * data.length);
        } else {
            randomIndex = 0;
        }
    };
</script>

<div
    class="text-left p-2 rounded-md max-w-3xs max-h-48 overflow-y-auto custom-scrollbar-2"
>
    {#if preview}
        <div class="relative">
            <pre
                class="text-xs text-foreground/80 whitespace-pre-wrap font-mono">
{JSON.stringify(preview, null, 2)}
        </pre>
        </div>
        <Button
            class="absolute bottom-2.5 right-2.5 hover:bg-transparent hover:text-primary [&_svg]:transition-transform hover:[&_svg]:scale-110 hover:[&_svg]:rotate-12 active:[&_svg]:rotate-180 active:text-primary/50"
            variant="ghost"
            size="icon"
            onclick={selectRandom}
        >
            <RefreshCw class="h-5 w-5" />
        </Button>
    {:else}
        <p class="text-sm text-center text-muted-foreground">
            Connect to preview output
        </p>
    {/if}
</div>
