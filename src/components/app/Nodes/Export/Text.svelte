<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import Button from "@ui/Button/Button.svelte";
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

    const handleExport = () => {
        const stringData = data
            .map((d) => (typeof d === "object" ? JSON.stringify(d) : d))
            .join("\n");
        const blob = new Blob([stringData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
</script>

<div
    class="flex-[1_1_0] overflow-y-auto custom-scrollbar-2 flex flex-col gap-2"
>
    <NodeMessage
        class="flex-1"
        primary={inputEdges.length === 0 ? t("label.node.connect.input") : ""}
        mute={data.length === 0 ? t("label.node.nodata") : ""}
        success={data.length > 0 ? t("label.ready.to.export") : ""}
    />
    <Button size="sm" disabled={data.length === 0} onclick={handleExport}>
        {t("label.export")}
    </Button>
</div>
