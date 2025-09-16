<script module>
    import { getContext, setContext } from "svelte";

    /////////////////////////////
    ////        MENUS        ////
    /////////////////////////////
    const MENU_PORTAL_SUBSCRIBE = "menu_portal_subscribe";
    const MENU_PORTAL_UNSUBSCRIBE = "menu_portal_unsubscribe";
    const MENU_DISPLAY = "menu_display";

    /**
     * @typedef {{name?:string, x?:number, y?:number}} ShowMenu
     * @typedef {{hidden?:boolean, x?:number, y?:number}} MenuArgs
     * @typedef {import('svelte').Snippet<[MenuArgs]>} MenuSnippet
     */
    /**
     * @type {{[x:string]:MenuSnippet}}
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
    export const createMenuContext = () => {
        setContext(MENU_PORTAL_SUBSCRIBE, subscriber);
        setContext(MENU_PORTAL_UNSUBSCRIBE, unsubscriber);
        setContext(MENU_DISPLAY, displayMenu);
    };
    /**
     * @returns {(id:string, renderer:MenuSnippet)=>void}
     */
    export const getMenuSubscriber = () => {
        return getContext(MENU_PORTAL_SUBSCRIBE);
    };
    /**
     * @returns {(name:string)=>void}
     */
    export const getMenuUnubscriber = () => {
        return getContext(MENU_PORTAL_UNSUBSCRIBE);
    };

    /**
     * @returns {(name?:string, x?:number, y?:number)=>void}
     */
    export const getMenuDisplayer = () => {
        return getContext(MENU_DISPLAY);
    };
    // General mouse down
    /**
     * @param {MouseEvent} e
     */
    export const mouseDownOutsideMenu = (e) => {
        if (!showMenu.name) {
            return;
        }
        if (e.target instanceof HTMLElement) {
            if (e.target.closest("[data-menu]")) {
                return;
            }
            showMenu = {};
        }
    };
    export { menus };
</script>

{#snippet menus()}
    {#each Object.entries(menuPortal) as [name, menu] (name)}
        {@render menu({
            hidden: name === showMenu.name,
            x: showMenu.x,
            y: showMenu.y,
        })}
    {/each}
{/snippet}
