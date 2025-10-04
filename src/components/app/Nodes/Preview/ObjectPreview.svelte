<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";
    import { clamp } from "@utils/MathUtils";
    import NodeMessage from "../NodeMessage.svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let node = $derived(pipeline.nodes[id]);

    let inputEdges = $derived(pipeline.getEdgesOfHandle(node?.inputs?.[0]?.id));

    /**
     * @type {any[]}
     */
    let data = $derived.by(() => {
        if (inputEdges.length > 0 && pipelineData) {
            return inputEdges.flatMap((edge) => pipelineData[edge.id] || []);
        }
        return [];
    });

    let currentIndex = $state(0);

    $effect(() => {
        if (currentIndex > data.length) {
            currentIndex = data.length - 1;
        }
    });

    /**
     * @param {string} valueType
     */
    const getColor = (valueType) => {
        switch (valueType) {
            case "object":
                return "bg-yellow-500 text-background col-span-2";
            case "number":
                return "bg-green-500";
            case "string":
                return "bg-blue-500";
            case "boolean":
                return "bg-purple-500";
            default:
                return "bg-gray-400";
        }
    };
</script>

{#snippet entry({ obj })}
    {#if obj && typeof obj === "object"}
        <div class="grid grid-cols-2 gap-2 wrap-anywhere items-center">
            {#if obj instanceof Array}
                {#each obj as item}
                    <div class="border-b-muted-foreground border-2 col-span-2">
                        {@render entry({ obj: item })}
                    </div>
                {/each}
            {:else}
                {#each Object.entries(obj) as [key, value]}
                    <span
                        class={[
                            "text-xs rounded-md text-center p-1",
                            getColor(typeof value),
                        ]}>{key}</span
                    >
                    <div
                        class={[
                            typeof value === "object" ? "pl-4 col-span-2" : "",
                        ]}
                    >
                        {@render entry({ obj: value })}
                    </div>
                {/each}
            {/if}
        </div>
    {:else}
        <span class="text-xs text-foreground/75">{obj}</span>
    {/if}
{/snippet}

<div class="flex-1 flex flex-col gap-1">
    {#if data.length > 0}
        <div class="flex-[1_1_0] overflow-y-scroll custom-scrollbar-2">
            <div class="relative">
                {@render entry({ obj: data[currentIndex] })}
            </div>
        </div>
        <div class="flex gap-1 justify-between items-center">
            <Button
                variant="ghost"
                size="icon"
                class="h-6!"
                disabled={currentIndex === 0}
                onclick={() =>
                    (currentIndex = clamp(currentIndex - 1, 0, data.length))}
            >
                <ChevronLeft class="h-5 w-5" />
            </Button>
            <span class="flex-1 text-xs text-muted-foreground text-center"
                >{currentIndex + 1}/{data.length}</span
            >
            <Button
                variant="ghost"
                size="icon"
                class="h-6!"
                disabled={currentIndex === data.length - 1}
                onclick={() =>
                    (currentIndex = clamp(currentIndex + 1, 0, data.length))}
            >
                <ChevronRight class="h-5 w-5" />
            </Button>
        </div>
    {:else if inputEdges.length === 0}
        <NodeMessage
            class="flex-1 min-h-14"
            primary={t("label.node.objectpreview.connect")}
        />
    {:else}
        <NodeMessage class="flex-1 min-h-14" mute={t("label.node.nodata")} />
    {/if}
</div>
