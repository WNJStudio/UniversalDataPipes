<script>
    import { Plus, Trash } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";
    import Input from "./Input.svelte";
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";
    import { onMount } from "svelte";
    import { v4 } from "uuid";

    /**
     * @typedef {Object} InputListProps
     * @prop {any[]} items
     * @prop {import('svelte/elements').ClassValue} [listClass]
     */
    /** @type {InputListProps & import('svelte/elements').HTMLInputAttributes} */
    let { items = $bindable(), listClass, ...props } = $props();

    /**
     * @type {{id:string, value:any}[]}
     */
    let _items = $state([]);

    onMount(() => {
        if (items?.length > 0) {
            _items = items.map((/** @type {any} */ s) => ({
                id: v4(),
                value: s,
            }));
        }
    });

    const onAdd = () => {
        _items.push({ id: v4(), value: undefined });
        items = _items.map((s) => s.value);
    };

    /**
     * @param {number} i
     */
    const onRemove = (i) => {
        _items.splice(i, 1);
        items = _items.map((s) => s.value);
    };

    /**
     * @param {number} i
     * @param {any} value
     */
    const onChange = (i, value) => {
        _items[i].value = value;
        items = _items.map((s) => s.value);
    };
</script>

<div
    class={[
        "flex p-2 flex-col gap-2 overflow-y-auto custom-scrollbar-2",
        listClass,
    ]}
>
    {#each _items as { id, value }, index (id)}
        <div
            transition:smoothScale={{ axis: "height", min: true }}
            class="flex justify-between gap-2"
        >
            <Input
                {...props}
                class={["flex-1", props.class]}
                {value}
                onValueChange={(v) => onChange(index, v)}
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
