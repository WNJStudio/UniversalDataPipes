<script>
    import { onClickOutside, useDebounce } from "runed";

    /**
     * @typedef {Object} InputProps
     * @prop {number} [delay]
     * @prop {(v:any)=>any} onValueChange
     */
    /** @type {InputProps & import('svelte/elements').HTMLInputAttributes} */
    let { delay = 300, onValueChange, ...props } = $props();
    /**
     * @type {HTMLInputElement}
     */
    let ref = $state();

    const changeValue = useDebounce(onValueChange, () => delay);
    onClickOutside(
        () => ref,
        () => ref?.blur(),
    );
</script>

<input
    {...props}
    bind:this={ref}
    onclick={(e) => e.currentTarget.focus()}
    oninput={(e) => changeValue(e.currentTarget.value)}
    class={[
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        props.class,
    ]}
/>
