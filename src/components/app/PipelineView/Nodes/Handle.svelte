<script>
    import { t } from "../../../../i18n/i18n.svelte";
    import {
        HandleData,
        HandleDirLabels,
    } from "../../../../model/Handle.svelte";
    import Tooltip from "../../../ui/Tooltip/Tooltip.svelte";
    import { getIsPanning } from "../CanvasActions/Pan.svelte";
    /**
     * @typedef {Object} HandleProps
     * @prop {HandleData} handle
     */

    /** @type {HandleProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { handle, ...props } = $props();

    const isPanning = getIsPanning();
</script>

<Tooltip
    preferredSide={handle.dir === "IN" ? "left" : "right"}
    duration={100}
    delay={500}
>
    {#snippet content()}
        <p>{t(handle.name)}</p>
        <p class="text-muted-foreground">
            {t(HandleDirLabels[handle.dir])}: {t(handle.type.label)}
        </p>
    {/snippet}
    {#snippet trigger({ attach })}
        <div
            {@attach attach}
            {...props}
            data-handle-id={handle.id}
            data-handle-node-id={handle.nodeId}
            data-handle-type={handle.type.type}
            data-handle-dir={handle.dir}
            class={[
                "relative h-3.5 w-3.5 rounded-full border-2 border-background",
                isPanning() ? "" : "cursor-pointer",
                handle.dir === "IN" ? "-left-3" : "-right-1.5",
                handle.type.color,
                props.class,
            ]}
        >
            {@render props.children?.()}
        </div>
    {/snippet}
</Tooltip>
