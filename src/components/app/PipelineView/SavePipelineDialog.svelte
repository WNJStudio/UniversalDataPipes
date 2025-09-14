<script>
    import Button from "../../ui/Button/Button.svelte";
    import Dialog from "../../ui/Dialog/Dialog.svelte";
    import DialogDescription from "../../ui/Dialog/DialogDescription.svelte";
    import DialogFooter from "../../ui/Dialog/DialogFooter.svelte";
    import DialogHeader from "../../ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "../../ui/Dialog/DialogTitle.svelte";
    import Input from "../../ui/Input/Input.svelte";
    import Label from "../../ui/Label/Label.svelte";
    import FlySwap from "../../ui/Transitions/FlySwap.svelte";

    /**
     * @typedef {Object} SavePipelineDialogProps
     * @prop {string} name
     * @prop {(name:string)=>any} onSave
     * @prop {(name:string)=>boolean} checkName
     * @prop {boolean} isOpen
     */
    /** @type {SavePipelineDialogProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { name, onSave, checkName, isOpen = $bindable(), ...props } = $props();

    let inname = $derived(name);

    let overwriting = $derived(checkName(name));

    const check = () => {
        if (checkName(inname)) {
            overwriting = true;
        } else {
            overwriting = false;
        }
    };

    const handleValueChange = (v) => {
        inname = v;
        check();
    };

    const handleOnSave = () => {
        if (inname.trim()) {
            onSave(inname.trim());
            isOpen = false;
        }
    };

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
            <FlySwap
                toggle={overwriting}
                flyA={{ y: overwriting ? "-100%" : "100%" }}
                flyB={{ y: !overwriting ? "-100%" : "100%" }}
            >
                {#snippet a()}
                    <DialogTitle>Save Pipeline</DialogTitle>
                {/snippet}
                {#snippet b()}
                    <DialogTitle>Overwrite Pipeline</DialogTitle>
                {/snippet}
            </FlySwap>
            <FlySwap
                toggle={overwriting}
                flyA={{ x: overwriting ? "-100%" : "100%" }}
                flyB={{ x: !overwriting ? "-100%" : "100%" }}
            >
                {#snippet a()}
                    <DialogDescription>
                        Enter a name for your pipeline. This will be saved in
                        your browser's local storage.
                    </DialogDescription>
                {/snippet}
                {#snippet b()}
                    <DialogDescription>
                        You are going to overwrite the pipeline named <span
                            class="font-semibold">{inname}</span
                        >. Proceed if you are sure.
                    </DialogDescription>
                {/snippet}
            </FlySwap>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input
                    id="name"
                    value={inname}
                    onValueChange={handleValueChange}
                    class="col-span-3"
                />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onclick={handleCancel}>Cancel</Button>
            <FlySwap
                toggle={overwriting}
                flyA={{ x: "100%" }}
                flyB={{ x: "100%" }}
            >
                {#snippet a()}
                    <Button
                        type="submit"
                        onclick={handleOnSave}
                        disabled={!inname?.trim()}>Save Pipeline</Button
                    >
                {/snippet}
                {#snippet b()}
                    <Button
                        type="submit"
                        variant="destructive"
                        onclick={handleOnSave}
                        disabled={!inname?.trim()}>Overwrite Pipeline</Button
                    >
                {/snippet}
            </FlySwap>
        </DialogFooter>
    {/snippet}
</Dialog>
