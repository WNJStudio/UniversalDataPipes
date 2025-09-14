<script>
    import AlertDialogContent from "./AlertDialogContent.svelte";
    import DialogContent from "./DialogContent.svelte";
    /**
     * @typedef {Object} DialogProps
     * @prop {import('svelte').Snippet} content
     * @prop {import('svelte').Snippet<[{attach:import('svelte/attachments').Attachment}]>} [trigger]
     * @prop {boolean} [closeOnOverlay]
     * @prop {boolean} isOpen
     * @prop {boolean} [isAlert]
     * @prop {()=>any} [onConfirm]
     * @prop {()=>any} [onClose]
     * @prop {()=>any} [onCancel]
     */

    /** @type {DialogProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        content,
        trigger,
        isOpen = $bindable(),
        isAlert = false,
        ...props
    } = $props();
    /**
     * @param {MouseEvent} e
     */
    const openDialog = (e) => {
        e.stopPropagation();
        isOpen = true;
    };

    /**
     * @param {HTMLElement} el
     */
    const attach = (el) => {
        el.addEventListener("click", openDialog);

        return () => {
            el.removeEventListener("click", openDialog);
        };
    };
</script>

{@render trigger?.({ attach })}
{#if isAlert}
    <AlertDialogContent bind:isOpen {...props}>
        {@render content?.()}
    </AlertDialogContent>
{:else}
    <DialogContent bind:isOpen {...props}>
        {@render content?.()}
    </DialogContent>
{/if}
