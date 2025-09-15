<script>
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
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete the
                pipeline file
                <span class="font-semibold"> {actionCandidateName}</span>.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <AlertDialogCancel onclick={closeDialog}>Cancel</AlertDialogCancel>
            <Button onclick={handleDelete}>Continue</Button>
        </DialogFooter>
    {/snippet}
</Dialog>
