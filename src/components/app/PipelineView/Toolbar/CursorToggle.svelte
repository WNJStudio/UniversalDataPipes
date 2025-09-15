<script>
    import { Hand, MousePointer } from "@lucide/svelte";
    import Button from "../../../ui/Button/Button.svelte";

    /**
     * @typedef {Object} CursorToggleProps
     * @prop {boolean} panMode
     */
    /** @type {CursorToggleProps } */
    let { panMode = $bindable() } = $props();
</script>

<Button
    tooltipSide="top"
    variant="ghost"
    size="icon"
    onclick={() => (panMode = !panMode)}
>
    {#snippet tooltip()}
        <p class="text-xs">
            {panMode ? "Pan Mode (P)" : "Select Mode (V)"}
        </p>
    {/snippet}
    {#if panMode}
        <Hand class="h-5 w-5" />
    {:else}
        <MousePointer class="h-5 w-5" />
    {/if}
</Button>
