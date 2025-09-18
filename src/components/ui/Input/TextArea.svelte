<script>
    import { useDebounce } from "runed";

    /**
     * @typedef {Object} TextAreaProps
     * @prop {number} [delay]
     * @prop {(v:any)=>any} onValueChange
     */
    /** @type {TextAreaProps & import('svelte/elements').HTMLTextareaAttributes} */
    let { delay = 300, onValueChange, ...props } = $props();

    const changeValue = useDebounce(onValueChange, () => delay);
</script>

<textarea
    {...props}
    oninput={(e) => changeValue(e.currentTarget.value)}
    class={[
        "flex min-h-[80px] w-full custom-scrollbar rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        props.class,
    ]}
></textarea>
