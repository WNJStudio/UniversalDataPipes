<script>
    import { PressedKeys } from "runed";
    import { fade, scale } from "svelte/transition";
    import DialogOverlay from "./DialogOverlay.svelte";
    /**
     * @typedef {Object} AlertDialogContentProps
     * @prop {boolean} isOpen
     * @prop {boolean} [closeOnOverlay]
     * @prop {()=>any} [onConfirm]
     * @prop {()=>any} [onClose]
     * @prop {()=>any} [onCancel]
     */
    /** @type {AlertDialogContentProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        isOpen = $bindable(),
        closeOnOverlay = true,
        onConfirm,
        onClose,
        onCancel,
        ...props
    } = $props();
    const keys = new PressedKeys();

    const tryClosing = () => {
        if (onCancel) {
            onCancel();
        } else if (onClose) {
            onClose();
        } else {
            isOpen = false;
        }
    };

    keys.onKeys("Escape", () => {
        tryClosing();
    });
</script>

{#if isOpen}
    <div
        transition:fade={{ delay: 150, duration: 150 }}
        {...props}
        class={[
            "fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center",
            props.class,
        ]}
    >
        <DialogOverlay
            hidden={!isOpen}
            onclick={closeOnOverlay ? tryClosing : undefined}
        />
        <div
            transition:scale={{ duration: 150 }}
            {...props}
            role="dialog"
            class={[
                "z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
                props.class,
            ]}
        >
            {@render props.children?.()}
        </div>
    </div>
{/if}
