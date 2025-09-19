<script module>
    /////////////////////////////
    ////      TOOLTIP        ////
    /////////////////////////////
    /**
     * @typedef {import('svelte').Snippet<[{hidden:boolean}]>} TooltipSnippet
     */
    /**
     * @type {Object<string,TooltipSnippet>}
     */
    let tooltipPortal = $state({});
    /**
     * @type {string}
     */
    let showtip = $state();
    /**
     * @param {string} id
     * @param {TooltipSnippet} renderer
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

    const displayTooltip = (id) => {
        showtip = id;
    };

    /**
     * @returns {(id:string, renderer:TooltipSnippet)=>void}
     */
    export const getTooltipSubscriber = () => subscriber;
    /**
     * @returns {(id:string)=>void}
     */
    export const getTooltipUnubscriber = () => unsubscriber;

    /**
     * @returns {(id:string)=>void}
     */
    export const getTooltipDisplayer = () => displayTooltip;

    export { tooltips };
</script>

{#snippet tooltips()}
    {#each Object.entries(tooltipPortal) as [id, tooltip] (id)}
        {@render tooltip({ hidden: id === showtip })}
    {/each}
{/snippet}
