<script>
    import Button from "../Button/Button.svelte";

    /**
     * @typedef {Object} AlertDialogCancelProps
     * @prop {string} [p]
     */
    /** @type {AlertDialogCancelProps & import('svelte/elements').HTMLButtonAttributes} */
    let { ...props } = $props();
</script>

<Button {...props} variant="outline" class={["mt-2 sm:mt-0", props.class]}>
    {@render props.children?.()}
</Button>
