<script>
    import { getMenuDisplayer } from "@portal/MenuPortal.svelte";

    /**
     * @typedef {Object} DropdownMenuItemProps
     * @prop {(e:MouseEvent)=>any} [onClick]
     * @prop {boolean} [inset]
     */
    /** @type {DropdownMenuItemProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { onClick, inset = false, ...props } = $props();

    const portalShow = getMenuDisplayer();

    /**
     *
     * @param {MouseEvent} e
     */
    const handleClick = (e) => {
        onClick?.(e);
        portalShow(undefined);
    };
</script>

<div
    {...props}
    onclick={handleClick}
    class={[
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset ? "pl-8" : "",
        props.class,
    ]}
>
    {@render props.children?.()}
</div>
