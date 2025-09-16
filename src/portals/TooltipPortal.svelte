<script module>
    import { getContext, setContext } from "svelte";
    const TOOLTIP_PORTAL_SUBSCRIBE = "tooltip_portal_subscribe";
    const TOOLTIP_PORTAL_UNSUBSCRIBE = "tooltip_portal_unsubscribe";
    const TOOLTIP_DISPLAY = "tooltip_display";
    /////////////////////////////
    ////      TOOLTIP        ////
    /////////////////////////////
    /**
     * @type {{[x:string]:import('svelte').Snippet<[{hidden:boolean}]>}}
     */
    let tooltipPortal = $state({});
    /**
     * @type {string}
     */
    let showtip = $state();
    /**
     * @param {string} id
     * @param {import('svelte').Snippet<[{hidden:boolean}]>} renderer
     */
    const subscriber = (id, renderer) => {
        tooltipPortal[id] = renderer;
    };

    /**
     * @param {string} id
     */
    const unsubscriber = (id) => {
        delete tooltipPortal[id];
    };

    export const createTooltipContext = () => {
        setContext(TOOLTIP_PORTAL_SUBSCRIBE, subscriber);
        setContext(TOOLTIP_PORTAL_UNSUBSCRIBE, unsubscriber);
        setContext(
            TOOLTIP_DISPLAY,
            (/** @type {string} */ id) => (showtip = id),
        );
    };
    /**
     * @returns {(id:string, renderer:import('svelte').Snippet<[{hidden:boolean}]>)=>void}
     */
    export const getTooltipSubscriber = () => {
        return getContext(TOOLTIP_PORTAL_SUBSCRIBE);
    };
    /**
     * @returns {(id:string)=>void}
     */
    export const getTooltipUnubscriber = () => {
        return getContext(TOOLTIP_PORTAL_UNSUBSCRIBE);
    };

    /**
     * @returns {(id:string)=>void}
     */
    export const getTooltipDisplayer = () => {
        return getContext(TOOLTIP_DISPLAY);
    };

    export { tooltips };
</script>

{#snippet tooltips()}
    {#each Object.entries(tooltipPortal) as [id, tooltip] (id)}
        {@render tooltip({ hidden: id === showtip })}
    {/each}
{/snippet}
