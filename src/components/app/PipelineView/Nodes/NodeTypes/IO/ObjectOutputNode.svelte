<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { RefreshCw } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";

    /** @type {import('../NodeProps.svelte').NodeProps} */
    let { inputs, outputs } = $props();

    const pipelineData = dataContext.get();

    const { edges } = pipelineContext.get();

    /**
     * @type {import("@model/Edge.svelte").EdgeData[]}
     */
    let myEdges = $derived.by(() => {
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
     * @type {any[]}
     */
    let data = $derived.by(() => {
        if (myEdges.length > 0 && pipelineData) {
            return myEdges.flatMap((edge) => pipelineData[edge.id] || []);
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
    class="text-left p-2 rounded-md flex-[1_1_0] min-h-14 overflow-y-scroll custom-scrollbar-2"
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
            {t("label.node.objectpreview.connect")}
        </p>
    {/if}
</div>
