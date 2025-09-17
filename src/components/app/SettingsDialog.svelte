<script>
    import {
        getGridChanger,
        getGridSize,
        getSnapToggler,
        getSnapToGrid,
    } from "../../context/SettingsContext.svelte";
    import Dialog from "../ui/Dialog/Dialog.svelte";
    import DialogDescription from "../ui/Dialog/DialogDescription.svelte";
    import DialogHeader from "../ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "../ui/Dialog/DialogTitle.svelte";
    import Label from "../ui/Label/Label.svelte";
    import Separator from "../ui/Separator/Separator.svelte";
    import Slider from "../ui/Slider/Slider.svelte";
    import Switch from "../ui/Switch/Switch.svelte";

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
                        class="font-normal leading-snug text-muted-foreground"
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
            </div>
        </div>
    {/snippet}
</Dialog>
