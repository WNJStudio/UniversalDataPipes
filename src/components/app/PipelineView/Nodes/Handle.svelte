<script>
    import { HandleData } from "../../../../model/Node.svelte";
    import Tooltip from "../../../ui/Tooltip/Tooltip.svelte";
    /**
     * @typedef {Object} HandleProps
     * @prop {HandleData} handle
     */

    /** @type {HandleProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { handle, ...props } = $props();
</script>

<Tooltip
    preferredSide={handle.dir === "IN" ? "left" : "right"}
    duration={100}
    flyOpposite
    delay={500}
>
    {#snippet content()}
        <p>{handle.name}</p>
        <p class="text-muted-foreground">{handle.dir}: {handle.type}</p>
    {/snippet}
    {#snippet trigger({ attach })}
        <div
            {@attach attach}
            {...props}
            data-handle-id={handle.id}
            data-handle-node-id={handle.nodeId}
            data-handle-type={handle.type}
            data-handle-dir={handle.dir}
            class={[
                "handle",
                "relative h-3.5 w-3.5 rounded-full border-2 border-background cursor-pointer",
                handle.dir === "IN" ? "-left-1.5" : "-right-1.5",
                props.class,
            ]}
            style={`background-color: ${handle.color};`}
        >
            {@render props.children?.()}
        </div>
    {/snippet}
</Tooltip>
