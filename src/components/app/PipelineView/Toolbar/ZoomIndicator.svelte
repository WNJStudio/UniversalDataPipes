<script>
    /**
     * @typedef {Object} ZoomIndicatorProps
     * @prop {number} currentZoom
     */
    /** @type {ZoomIndicatorProps } */
    let { currentZoom } = $props();
</script>

<p class="select-none text-xs text-muted-foreground min-w-10 text-center">
    {(currentZoom * 100).toFixed(0)}%
</p>
