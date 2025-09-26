<script>
    import {
        CROSSES,
        DOTS,
        getCurrentPattern,
        getGridChanger,
        getGridSize,
        getPatternChanger,
        getSnapToggler,
        getSnapToGrid,
        LINES,
    } from "@context/SettingsContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import Label from "@ui/Label/Label.svelte";
    import RadioGroup from "@ui/RadioGroup/RadioGroup.svelte";
    import RadioGroupItem from "@ui/RadioGroup/RadioGroupItem.svelte";
    import Separator from "@ui/Separator/Separator.svelte";
    import Slider from "@ui/Slider/Slider.svelte";
    import Switch from "@ui/Switch/Switch.svelte";
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";
    const labelClasses =
        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary";

    /**
     * @typedef {Object} GridTabProps
     * @prop {boolean} hidden
     */
    /** @type {GridTabProps } */
    let { hidden } = $props();
    const isSnapEnabled = getSnapToGrid();
    const snapToggler = getSnapToggler();
    const gridSize = getGridSize();
    const gridChanger = getGridChanger();
    const currentPattern = getCurrentPattern();
    const patternSetter = getPatternChanger();
</script>

{#if !hidden}
    <div
        in:smoothScale={{ delay: 300, axis: "height" }}
        out:smoothScale={{ axis: "height" }}
        class="grid gap-6 py-4"
    >
        <div class="flex items-center justify-between">
            <Label for="snap-to-grid" class="flex flex-col space-y-1">
                <span>{t("label.settings.snaptogrid")}</span>
                <span
                    class="text-xs font-normal leading-snug text-muted-foreground"
                >
                    {t("label.settings.snaptogrid.description")}
                </span>
            </Label>
            <Switch
                id="snap-to-grid"
                checked={isSnapEnabled()}
                toggler={snapToggler}
            />
        </div>
        <Separator />
        <div class="grid gap-4">
            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <Label for="grid-size">{t("label.settings.gridsize")}</Label
                    >
                    <span class="text-sm text-muted-foreground"
                        >{gridSize()}px</span
                    >
                </div>
                <Slider
                    id="grid-size"
                    min={1}
                    max={200}
                    step={1}
                    value={gridSize()}
                    valueChanger={(value) => gridChanger(value)}
                />
                <span
                    class="text-xs font-normal leading-snug text-muted-foreground"
                >
                    {t("label.settings.gridsize.description")}
                </span>
            </div>
            <div class="grid gap-2">
                <Label>{t("label.settings.gridpattern")}</Label>
                <RadioGroup class="grid grid-cols-3 gap-2">
                    <div>
                        <RadioGroupItem
                            value={DOTS}
                            id={DOTS}
                            currentValue={currentPattern()}
                            valueSetter={patternSetter}
                            class="peer sr-only"
                        />
                        <Label for={DOTS} class={labelClasses}
                            >{t("label.settings.gridpattern.dots")}</Label
                        >
                    </div>
                    <div>
                        <RadioGroupItem
                            value={LINES}
                            id={LINES}
                            currentValue={currentPattern()}
                            valueSetter={patternSetter}
                            class="peer sr-only"
                        />
                        <Label for={LINES} class={labelClasses}
                            >{t("label.settings.gridpattern.lines")}</Label
                        >
                    </div>
                    <div>
                        <RadioGroupItem
                            value={CROSSES}
                            id={CROSSES}
                            currentValue={currentPattern()}
                            valueSetter={patternSetter}
                            class="peer sr-only"
                        />
                        <Label for={CROSSES} class={labelClasses}
                            >{t("label.settings.gridpattern.crosses")}</Label
                        >
                    </div>
                </RadioGroup>
                <span
                    class="text-xs font-normal leading-snug text-muted-foreground"
                >
                    {t("label.settings.gridpattern.description")}
                </span>
            </div>
        </div>
    </div>
{/if}
