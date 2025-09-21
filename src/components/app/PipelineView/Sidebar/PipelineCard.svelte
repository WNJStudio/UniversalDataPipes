<script>
    import { slide } from "svelte/transition";
    import Card from "../../../ui/Card/Card.svelte";
    import Tooltip from "../../../ui/Tooltip/Tooltip.svelte";
    import CardTitle from "../../../ui/Card/CardTitle.svelte";
    import CardDescription from "../../../ui/Card/CardDescription.svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import { EllipsisVertical, SquareArrowOutUpRight } from "@lucide/svelte";
    import { Pipeline } from "../../../../model/Pipeline.svelte";
    import { t } from "../../../../i18n/i18n.svelte";

    /**
     * @typedef {Object} PipelineCardProps
     * @prop {Pipeline} pipeline
     * @prop {(e:MouseEvent)=>any} handlePipelineMore
     * @prop {(p:Pipeline)=>any} onLoad
     */
    /** @type {PipelineCardProps} */
    let { pipeline, handlePipelineMore, onLoad } = $props();
</script>

<div transition:slide={{ axis: "y" }}>
    <Card data-key={pipeline.name} class="overflow-hidden group">
        <div class="p-3 flex justify-between items-start">
            <div class="overflow-hidden">
                <Tooltip delay={800} preferredSide="top">
                    {#snippet content()}
                        {pipeline.name}
                    {/snippet}
                    {#snippet trigger({ attach })}
                        <CardTitle
                            {attach}
                            class="text-base overflow-ellipsis overflow-hidden"
                            >{pipeline.name}</CardTitle
                        >
                    {/snippet}
                </Tooltip>
                <CardDescription class="text-xs mt-1">
                    {t("template.pipeline.savedat", pipeline.saveLocalString)}
                </CardDescription>
            </div>
            <Button
                onclick={handlePipelineMore}
                variant="ghost"
                size="icon"
                class="h-8 w-8 -mr-2 -mt-1"
            >
                <EllipsisVertical class="h-4 w-4" />
            </Button>
        </div>
        <div class="flex bg-muted/50 border-t">
            <Button
                tooltipSide="bottom"
                variant="ghost"
                size="sm"
                class="flex-1 rounded-none"
                onclick={() => onLoad(pipeline)}
            >
                {#snippet tooltip()}
                    {t("label.pipeline.load")}
                {/snippet}
                <SquareArrowOutUpRight class="h-4 w-4" />
            </Button>
        </div>
    </Card>
</div>
