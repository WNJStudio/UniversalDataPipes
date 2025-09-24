<script module>
    /////////////////////////////
    ////        MENUS        ////
    /////////////////////////////

    /**
     * @typedef {{name?:string, x?:number, y?:number}} ShowMenu
     * @typedef {{hidden?:boolean, x?:number, y?:number}} MenuArgs
     * @typedef {import('svelte').Snippet<[MenuArgs]>} MenuSnippet
     */
    /**
     * @type {Object<string,MenuSnippet>}
     */
    let menuPortal = $state({});
    /**
     * @type {ShowMenu}
     */
    let showMenu = $state({});

    /**
     * @param {string} name
     * @param {MenuSnippet} renderer
     */
    const subscriber = (name, renderer) => {
        menuPortal[name] = renderer;
    };

    /**
     * @param {string} name
     */
    const unsubscriber = (name) => {
        delete menuPortal[name];
    };

    /**
     *
     * @param {string} name
     * @param {number} [x]
     * @param {number} [y]
     */
    const displayMenu = (name, x, y) => {
        showMenu = { name, x, y };
    };

    export const getMenuSubscriber = () => subscriber;

    export const getMenuUnubscriber = () => unsubscriber;

    export const getMenuDisplayer = () => displayMenu;
</script>

{#each Object.entries(menuPortal) as [name, menu] (name)}
    {@render menu({
        hidden: name === showMenu.name,
        x: showMenu.x,
        y: showMenu.y,
    })}
{/each}
