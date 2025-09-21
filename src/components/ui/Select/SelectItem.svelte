<script>
    import { Check } from "@lucide/svelte";

    /**
     * @typedef {Object} SelectItemProps
     * @prop {boolean} isSelected
     * @prop {string} value
     * @prop {(s:string)=>void} valueSetter
     * @prop {string} label
     */
    /** @type {SelectItemProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { isSelected, value, label, valueSetter, ...props } = $props();
    const onclick = () => {
        valueSetter(value);
    };
</script>

<div
    {...props}
    {onclick}
    role="option"
    aria-selected={isSelected}
    class={[
        "relative flex w-full cursor-default transition-colors select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        props.class,
    ]}
>
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {#if isSelected}
            <Check class="h-4 w-4" />
        {/if}
    </span>
    {label}
</div>
