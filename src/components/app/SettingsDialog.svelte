<script>
    import {
        CROSSES,
        DOTS,
        getCurrentPattern,
        getGridChanger,
        getGridSize,
        getLastSavedSince,
        getPatternChanger,
        getSnapToggler,
        getSnapToGrid,
        LINES,
    } from "../../context/SettingsContext.svelte";
    import Dialog from "../ui/Dialog/Dialog.svelte";
    import DialogDescription from "../ui/Dialog/DialogDescription.svelte";
    import DialogHeader from "../ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "../ui/Dialog/DialogTitle.svelte";
    import Label from "../ui/Label/Label.svelte";
    import RadioGroup from "../ui/RadioGroup/RadioGroup.svelte";
    import RadioGroupItem from "../ui/RadioGroup/RadioGroupItem.svelte";
    import Separator from "../ui/Separator/Separator.svelte";
    import Slider from "../ui/Slider/Slider.svelte";
    import Switch from "../ui/Switch/Switch.svelte";

    const labelClasses =
        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary";

    /**
     * @typedef {Object} SettingsDialogProps
     * @prop {boolean} isOpen
     */
    /** @type {SettingsDialogProps & import('svelte/elements').SvelteHTMLElements['']} */
    let { isOpen = $bindable(), ...props } = $props();

    const isSnapEnabled = getSnapToGrid();
    const snapToggler = getSnapToggler();
    const gridSize = getGridSize();
    const gridChanger = getGridChanger();
    const lastSavedSince = getLastSavedSince();
    const currentPattern = getCurrentPattern();
    const patternSetter = getPatternChanger();

    const handleCancel = () => {
        isOpen = false;
    };
</script>

<Dialog
    class={["sm:max-w-[425px]", props.class]}
    bind:isOpen
    onCancel={handleCancel}
    onClose={handleCancel}
>
    {#snippet content()}
        <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
                Customize your UDP experience.
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-6 py-4">
            <div class="flex items-center justify-between">
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
                            <Label for={LINES} class={labelClasses}>
                                Lines
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem
                                value={CROSSES}
                                id={CROSSES}
                                currentValue={currentPattern()}
                                valueSetter={patternSetter}
                                class="peer sr-only"
                            />
                            <Label for={CROSSES} class={labelClasses}>
                                Crosses
                            </Label>
                        </div>
                    </RadioGroup>
                    <span
                        class="text-xs font-normal leading-snug text-muted-foreground"
                    >
                        Choose the visual style of the background grid.
                    </span>
                </div>
            </div>
            <Separator />
            <div class="grid gap-4">
                <span
                    class="text-xs font-normal leading-snug text-muted-foreground"
                    >{lastSavedSince()}</span
                >
            </div>
        </div>
    {/snippet}
</Dialog>
