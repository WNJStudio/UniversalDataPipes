<script module>
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

    const displayTooltip = (id) => {
        showtip = id;
    };

    /**
     * @returns {(id:string, renderer:import('svelte').Snippet<[{hidden:boolean}]>)=>void}
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
