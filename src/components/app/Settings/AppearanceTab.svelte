<script>
    import FlyOut from "../../ui/Transitions/FlyOut.svelte";

    /**
     * @typedef {Object} AppearanceTabProps
     * @prop {boolean} hidden
     */
    /** @type {AppearanceTabProps} */
    let { hidden } = $props();
</script>

<FlyOut {hidden} y="100%" class="grid gap-6 py-4">
    <!-- <div class="flex items-center justify-between">
        <Label for="snap-to-grid" class="flex flex-col space-y-1">
            <span>Snap to Grid</span>
            <span
                class="text-xs font-normal leading-snug text-muted-foreground"
            >
                Automatically align nodes to the grid.
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
                <Label for="grid-size">Grid Size</Label>
                <span class="text-sm text-muted-foreground">{gridSize()}px</span
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
                Controls the snapping distance for nodes.
            </span>
        </div>
        <div class="grid gap-2">
            <Label>Grid Pattern</Label>
            <RadioGroup class="grid grid-cols-3 gap-2">
                <div>
                    <RadioGroupItem
                        value={DOTS}
                        id={DOTS}
                        currentValue={currentPattern()}
                        valueSetter={patternSetter}
                        class="peer sr-only"
                    />
                    <Label for={DOTS} class={labelClasses}>Dots</Label>
                </div>
                <div>
                    <RadioGroupItem
                        value={LINES}
                        id={LINES}
                        currentValue={currentPattern()}
                        valueSetter={patternSetter}
                        class="peer sr-only"
                    />
                    <Label for={LINES} class={labelClasses}>Lines</Label>
                </div>
                <div>
                    <RadioGroupItem
                        value={CROSSES}
                        id={CROSSES}
                        currentValue={currentPattern()}
                        valueSetter={patternSetter}
                        class="peer sr-only"
                    />
                    <Label for={CROSSES} class={labelClasses}>Crosses</Label>
                </div>
            </RadioGroup>
            <span
                class="text-xs font-normal leading-snug text-muted-foreground"
            >
                Choose the visual style of the background grid.
            </span>
        </div>
    </div> -->
</FlyOut>
