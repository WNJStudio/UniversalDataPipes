<script>
    import { t } from "../../../../i18n/i18n.svelte";
    import Button from "../../../ui/Button/Button.svelte";
    import AlertDialogCancel from "../../../ui/Dialog/AlertDialogCancel.svelte";
    import Dialog from "../../../ui/Dialog/Dialog.svelte";
    import DialogDescription from "../../../ui/Dialog/DialogDescription.svelte";
    import DialogFooter from "../../../ui/Dialog/DialogFooter.svelte";
    import DialogHeader from "../../../ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "../../../ui/Dialog/DialogTitle.svelte";

    /**
     * @typedef {Object} DeleteDialogProps
     * @prop {boolean} deleteDialogOpen
     * @prop {()=>any} closeDialog
     * @prop {string} actionCandidateName
     * @prop {()=>any} handleDelete
     */
    /** @type {DeleteDialogProps} */
    let {
        deleteDialogOpen = $bindable(),
        closeDialog,
        actionCandidateName,
        handleDelete,
    } = $props();
</script>

<Dialog
    isAlert
    bind:isOpen={deleteDialogOpen}
    onClose={closeDialog}
    onCancel={closeDialog}
>
    {#snippet content()}
        <DialogHeader>
            <DialogTitle>{t("label.alert.sure")}</DialogTitle>
            <DialogDescription>
                {t("label.dialog.delete.description")}
                <span class="font-semibold"> {actionCandidateName}</span>
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <AlertDialogCancel onclick={closeDialog}
                >{t("label.dialog.cancel")}</AlertDialogCancel
            >
            <Button onclick={handleDelete}>{t("label.dialog.continue")}</Button>
        </DialogFooter>
    {/snippet}
</Dialog>
