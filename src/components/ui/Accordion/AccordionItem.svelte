<script>
    import { ChevronDown } from "@lucide/svelte";
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";
    import { accordionContext } from "./AccordionContext.svelte";

    /**
     * @typedef {Object} AccordionItemProps
     * @prop {string} value
     * @prop {string} [label]
     */
    /** @type {AccordionItemProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { value, label = value, ...props } = $props();
    const { values, getHandleToggle } = accordionContext.get();
    const handleToggle = getHandleToggle();
    const isOpen = $derived(values().includes(value));
</script>

<div
    {...props}
    data-state={isOpen ? "open" : "closed"}
    class={["border-b", props.class]}
>
    <h3 class="flex">
        <button
            onclick={() => handleToggle(value)}
            data-state={isOpen ? "open" : "closed"}
            class={[
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                "text-sm font-medium",
            ]}
        >
            {label}
            <ChevronDown
                class="h-4 w-4 shrink-0 transition-transform duration-200"
            />
        </button>
    </h3>
    {#if isOpen}
        <div
            transition:smoothScale={{ axis: "height" }}
            class={["overflow-hidden text-sm transition-all"]}
            {...props}
        >
            <div class="pb-4 pt-0">{@render props.children?.()}</div>
        </div>
    {/if}
</div>
