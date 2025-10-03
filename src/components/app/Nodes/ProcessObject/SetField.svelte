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

    let fieldName = $state("");

    let message = $derived(
        fieldName === ""
            ? t("label.node.set.field.name")
            : t("label.node.set.field.success"),
    );

    let node = $derived(pipeline.nodes[id]);

    let originalObjectEdges = $derived(
        pipeline.getEdgesOfHandle(node?.inputs?.[0]?.id),
    );
    let fieldDataEdges = $derived(
        pipeline.getEdgesOfHandle(node?.inputs?.[1]?.id),
    );

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    /**
     * @type {Object[]}
     */
    let originalObjects = $derived.by(() => {
        if (originalObjectEdges.length > 0 && pipelineData) {
            return originalObjectEdges.flatMap(
                (edge) => pipelineData[edge.id] || [],
            );
        }
        return [];
    });

    /**
     * @type {any[]}
     */
    let fieldData = $derived.by(() => {
        if (fieldDataEdges.length > 0 && pipelineData) {
            return fieldDataEdges.flatMap(
                (edge) => pipelineData[edge.id] || [],
            );
        }
        return [];
    });

    onMount(() => {
        if (fieldName === "" && node.config.fieldName) {
            fieldName = node.config.fieldName;
        }
    });

    $effect(() => {
        if (outputEdges.length > 0 && fieldName !== "") {
            let outputData = [];
            if (originalObjects.length > 0) {
                originalObjects.forEach((o, i) => {
                    outputData.push({ ...o, [fieldName]: fieldData[i] });
                });
            } else {
                fieldData.forEach((d) => {
                    outputData.push({ [fieldName]: d });
                });
            }
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
     * @param {string} v
     */
    const setFieldname = (v) => {
        fieldName = v;
    };
</script>

<div class="flex-1 flex flex-col gap-2 min-h-20 justify-between">
    <Input
        placeholder={t("label.node.field.name")}
        value={fieldName}
        onValueChange={setFieldname}
    />
    <div class="flex-1 flex items-center justify-center">
        <span class="text-center text-sm text-primary">
            {message}
        </span>
    </div>
</div>
