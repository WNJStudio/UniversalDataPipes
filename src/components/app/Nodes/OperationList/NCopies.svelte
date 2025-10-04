<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import Input from "@ui/Input/Input.svelte";
    import { onMount } from "svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();
    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let copies = $state(1);

    let node = $derived(pipeline.nodes[id]);

    let inputEdges = $derived(pipeline.getEdgesOfHandle(node?.inputs?.[0]?.id));

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    /**
     * @type {any[]}
     */
    let inputData = $derived.by(() => {
        if (inputEdges.length > 0 && pipelineData) {
            return inputEdges.flatMap((edge) => pipelineData[edge.id] || []);
        }
        return [];
    });

    onMount(() => {
        if (node.config.copies) {
            copies = node.config.copies;
        }
    });

    $effect(() => {
        if (outputEdges.length > 0) {
            let outputData = [];
            inputData.forEach((d) => {
                let list = [];
                for (let i = 0; i < copies; i++) {
                    list.push(d);
                }
                list = JSON.parse(JSON.stringify(list));
                outputData.push(list);
            });
            if (outputData.length > 0) {
                outputEdges.forEach((edge) => {
                    pipelineData[edge.id] = outputData;
                });
            } else {
                outputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });

    /**
     * @param {number} v
     */
    const setCopies = (v) => {
        copies = ~~v;
        node.config.copies = ~~v;
    };
</script>

<div class="flex-1 flex flex-col gap-2 justify-between">
    <Input
        placeholder={t("label.node.ncopies.copies")}
        value={copies}
        onValueChange={setCopies}
        type="number"
        min="1"
        step="1"
    />
</div>
