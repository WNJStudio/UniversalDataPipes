<script>
    import { Circle } from "@lucide/svelte";

    /**
     * @typedef {Object} RadioGroupItemProps
     * @prop {string} value
     * @prop {(v:string)=>void} [valueSetter]
     * @prop {string} [name]
     * @prop {string} currentValue
     */
    /** @type {RadioGroupItemProps & import('svelte/elements').HTMLButtonAttributes} */
    let {
        value,
        currentValue = $bindable(),
        valueSetter,
        name,
        ...props
    } = $props();
    let isChecked = $derived(value === currentValue);
</script>

<button
    role="radio"
    aria-checked={isChecked}
    data-state={isChecked ? "checked" : "unchecked"}
    {name}
    {value}
    onclick={() => (valueSetter ? valueSetter(value) : (currentValue = value))}
    class={[
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background",
        "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        props.class,
    ]}
    {...props}
>
    <div class="flex items-center justify-center">
        {#if isChecked}
            <Circle class="h-2.5 w-2.5 fill-current text-current" />
        {/if}
    </div>
</button>
