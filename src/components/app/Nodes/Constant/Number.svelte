<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { Plus, Trash } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";
    import Input from "@ui/Input/Input.svelte";
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";
    import { onMount } from "svelte";
    import { v4 } from "uuid";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let node = $derived(pipeline.nodes[id]);

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    /**
     * @type {{id:string, value:number}[]}
     */
    let numbers = $state([]);

    $effect(() => {
        if (outputEdges.length > 0) {
            if (numbers.length > 0) {
                outputEdges.forEach((edge) => {
                    pipelineData[edge.id] = numbers.map((s) => s.value);
                });
            } else {
                outputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });

    onMount(() => {
        if (node.config.numbers) {
            numbers = node.config.numbers?.map((/** @type {number} */ s) => ({
                id: v4(),
                value: s,
            }));
        }
    });

    const onAdd = () => {
        numbers.push({ id: v4(), value: 0 });
        node.config.numbers = numbers.map((s) => s.value);
    };

    /**
     * @param {number} i
     */
    const onRemove = (i) => {
        numbers.splice(i, 1);
        node.config.numbers = numbers.map((s) => s.value);
    };

    /**
     * @param {number} i
     * @param {number} value
     */
    const onChange = (i, value) => {
        numbers[i].value = value;
        node.config.numbers = numbers.map((s) => s.value);
    };
</script>

<div class="flex-1 flex flex-col gap-2 min-h-14">
    <div
        class="flex-[1_1_0] flex p-2 flex-col min-h-14 gap-2 overflow-y-auto custom-scrollbar-2"
    >
        {#each numbers as { id, value }, index (id)}
            <div
                transition:smoothScale={{ axis: "height", min: true }}
                class="flex justify-between gap-2"
            >
                <Input
                    class="flex-1"
                    {value}
                    onValueChange={(v) => onChange(index, v)}
                    type="number"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    class="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onclick={() => onRemove(index)}
                >
                    <Trash class="h-5 w-5" />
                </Button>
            </div>
        {/each}
    </div>
    <Button size="sm" onclick={onAdd}>
        <Plus class="h-5 w-5" />
    </Button>
</div>
