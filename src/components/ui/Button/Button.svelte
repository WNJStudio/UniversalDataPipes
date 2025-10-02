<script>
    import Tooltip from "../Tooltip/Tooltip.svelte";

    const VARIANTS = {
        default:
            "bg-primary text-primary-foreground hover:brightness-125 active:brightness-80",
        destructive:
            "bg-destructive text-destructive-foreground hover:brightness-125 active:brightness-80",
        outline:
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        floating:
            "bg-primary-foreground/20 hover:bg-primary-foreground/90 hover:text-primary/90 rounded-full!",
        link: "text-primary underline-offset-4 hover:underline",
    };
    const SIZES = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    /**
     * @typedef {Object} ButtonProps
     * @prop {import('svelte').Snippet} [tooltip]
     * @prop {"top"|"bottom"|"left"|"right"} [tooltipSide]
     * @prop {boolean} [toggle]
     * @prop {number} [delay]
     * @prop {import('svelte/attachments').Attachment} [attach]
     * @prop {boolean} [toggleStatus]
     * @prop {import('svelte').Snippet} [toggleOn]
     * @prop {import('svelte').Snippet} [toggleOff]
     * @prop {keyof VARIANTS} [variant]
     * @prop {keyof SIZES} [size]
     *
     */
    /** @type {ButtonProps & import('svelte/elements').HTMLButtonAttributes} */
    let {
        tooltip,
        tooltipSide,
        toggle,
        attach,
        toggleOn,
        toggleOff,
        toggleStatus,
        delay,
        variant = "default",
        size = "default",
        ...props
    } = $props();

    const baseClass =
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors";
    const focusClass =
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    const disabledClass = "disabled:pointer-events-none disabled:opacity-50";
    const svgClass =
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
</script>

{#snippet button({ attach })}
    <button
        {...props}
        {@attach attach}
        title=""
        type={props.type || "button"}
        class={[
            baseClass,
            focusClass,
            disabledClass,
            svgClass,
            VARIANTS[variant],
            SIZES[size],
            props.class,
        ]}
    >
        {#if toggle}
            {#if toggleStatus}
                {@render toggleOn?.()}
            {:else}
                {@render toggleOff?.()}
            {/if}
        {/if}
        {@render props.children?.()}
    </button>
{/snippet}

{#if tooltip}
    <Tooltip
        preferredSide={tooltipSide}
        content={tooltip}
        trigger={button}
        {delay}
    />
{:else}
    {@render button({ attach })}
{/if}
