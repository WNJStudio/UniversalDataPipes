<script>
    import { ChevronDown } from "@lucide/svelte";
    import SlideOut from "../Transitions/SlideOut.svelte";
    import SelectItem from "./SelectItem.svelte";
    import { onClickOutside } from "runed";

    /**
     * @typedef {Object} SelectProps
     * @prop {string} name
     * @prop {string} value
     * @prop {string} [placeholder]
     * @prop {(s:string)=>void} valueSetter
     * @prop {{value:string, label:string}[]} items
     */
    /** @type {SelectProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        name,
        value,
        valueSetter,
        items = [],
        placeholder,
        ...props
    } = $props();
    let isOpen = $state(false);
    let ref = $state();
    onClickOutside(
        () => ref,
        () => {
            if (isOpen) {
                isOpen = false;
            }
        },
    );
</script>

<div bind:this={ref} class={["relative", props.class]} {...props}>
    <button
        type="button"
        role="combobox"
        aria-controls={`select_${name}_content`}
        name={`select_${name}_trigger`}
        onclick={() => (isOpen = !isOpen)}
        aria-expanded={isOpen}
        class={[
            "flex h-10 w-full items-center justify-between transition-colors rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isOpen ? "outline-hidden ring-2 ring-ring ring-offset-2" : "",
        ]}
    >
        {#if value}
            <span class="line-clamp-1">
                {items.find((i) => i.value === value)?.label || value}
            </span>
        {:else if placeholder}
            <span class="text-muted-foreground">
                {placeholder}
            </span>
        {/if}
        <ChevronDown class="h-4 w-4 opacity-50" />
    </button>

    <SlideOut
        hidden={!isOpen}
        axis="y"
        class={[
            "absolute z-50 mt-1 max-h-96 min-w-32 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md custom-scrollbar",
            props.class,
        ]}
    >
        <div class="p-1">
            {#each items as item}
                <SelectItem
                    value={item.value}
                    label={item.label}
                    isSelected={value === item.value}
                    {valueSetter}
                />
            {/each}
        </div>
    </SlideOut>
</div>
