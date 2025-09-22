<script>
    /**
     * @typedef {Object} AppearanceTabProps
     * @prop {boolean} hidden
     */
    /** @type {AppearanceTabProps} */
    let { hidden } = $props();
</script>

{#if !hidden}
    <div class="grid gap-6 py-4"></div>
{/if}
