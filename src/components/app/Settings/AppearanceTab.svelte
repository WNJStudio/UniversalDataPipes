<script>
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";

    /**
     * @typedef {Object} AppearanceTabProps
     * @prop {boolean} hidden
     */
    /** @type {AppearanceTabProps} */
    let { hidden } = $props();
</script>

{#if !hidden}
    <div
        in:smoothScale={{ delay: 300, axis: "height" }}
        out:smoothScale={{ axis: "height" }}
        class="grid gap-6 py-4"
    ></div>
{/if}
