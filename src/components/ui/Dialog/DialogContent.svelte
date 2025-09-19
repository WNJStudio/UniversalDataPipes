<script>
    import { X } from "@lucide/svelte";
    import FadeOut from "../Transitions/FadeOut.svelte";
    import ScaleOut from "../Transitions/ScaleOut.svelte";
    import DialogOverlay from "./DialogOverlay.svelte";
    import { PressedKeys } from "runed";
    /**
     * @typedef {Object} DialogContentProps
     * @prop {boolean} isOpen
     * @prop {boolean} [closeOnOverlay]
     * @prop {()=>any} [onConfirm]
     * @prop {()=>any} [onClose]
     * @prop {()=>any} [onCancel]
     */
    /** @type {DialogContentProps & import('svelte/elements').SvelteHTMLElements['div']} */
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

<FadeOut
    {...props}
    hidden={!isOpen}
    delay={150}
    duration={150}
    class={["fixed inset-0 z-50 flex items-center justify-center", props.class]}
>
    <DialogOverlay
        hidden={!isOpen}
        onclick={closeOnOverlay ? tryClosing : undefined}
    />
    <ScaleOut
        {...props}
        role="dialog"
        hidden={!isOpen}
        duration={150}
        class={[
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            props.class,
        ]}
    >
        {@render props.children?.()}
        <button
            onclick={tryClosing}
            class={[
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
                "hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
            ]}
        >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
        </button>
    </ScaleOut>
</FadeOut>
