<script>
    import { t } from "@i18n/i18n.svelte";
    import Button from "@ui/Button/Button.svelte";
    import Dialog from "@ui/Dialog/Dialog.svelte";
    import DialogDescription from "@ui/Dialog/DialogDescription.svelte";
    import DialogFooter from "@ui/Dialog/DialogFooter.svelte";
    import DialogHeader from "@ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "@ui/Dialog/DialogTitle.svelte";
    import Input from "@ui/Input/Input.svelte";
    import Label from "@ui/Label/Label.svelte";
    import FlySwap from "@ui/Transitions/FlySwap.svelte";

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
                    <DialogTitle
                        >{t("label.dialog.save.title.save")}</DialogTitle
                    >
                {/snippet}
                {#snippet b()}
                    <DialogTitle
                        >{t("label.dialog.save.title.overwrite")}</DialogTitle
                    >
                {/snippet}
            </FlySwap>
            <FlySwap
                toggle={overwriting}
                flyA={{ x: overwriting ? "-100%" : "100%" }}
                flyB={{ x: !overwriting ? "-100%" : "100%" }}
            >
                {#snippet a()}
                    <DialogDescription>
                        {t("label.dialog.save.description.save")}
                    </DialogDescription>
                {/snippet}
                {#snippet b()}
                    <DialogDescription>
                        {t(
                            "template.dialog.save.description.overwrite",
                            inname,
                        )}
                    </DialogDescription>
                {/snippet}
            </FlySwap>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right"
                    >{t("label.dialog.save.name")}</Label
                >
                <Input
                    id="name"
                    delay={150}
                    value={inname}
                    onValueChange={handleValueChange}
                    class="col-span-3"
                />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onclick={handleCancel}
                >{t("label.dialog.cancel")}</Button
            >
            <FlySwap
                toggle={overwriting}
                flyA={{ x: "100%" }}
                flyB={{ x: "100%" }}
            >
                {#snippet a()}
                    <Button
                        type="submit"
                        onclick={handleOnSave}
                        disabled={!inname?.trim()}
                        >{t("label.dialog.save.title.save")}</Button
                    >
                {/snippet}
                {#snippet b()}
                    <Button
                        type="submit"
                        variant="destructive"
                        onclick={handleOnSave}
                        disabled={!inname?.trim()}
                        >{t("label.dialog.save.title.overwrite")}</Button
                    >
                {/snippet}
            </FlySwap>
        </DialogFooter>
    {/snippet}
</Dialog>
