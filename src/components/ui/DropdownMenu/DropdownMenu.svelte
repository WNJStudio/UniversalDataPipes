<script>
    import { getContext } from "svelte";
    import DropdownMenuContent from "./DropdownMenuContent.svelte";
    import {
        MENU_DISPLAY,
        MENU_PORTAL_SUBSCRIBE,
        MENU_PORTAL_UNSUBSCRIBE,
    } from "../../../constants";
    /**
     * @typedef {Object} DropdownMenuProps
     * @prop {import('svelte').Snippet<[{attach:import('svelte/attachments').Attachment}]>} [trigger]
     * @prop {import('svelte').Snippet} content
     * @prop {string} name
     */
    /** @type {DropdownMenuProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { trigger, content, name, ...props } = $props();
    let isOpen = $state(false);
    let triggerRef = $state();

    /**
     * @type {(id:string,s:import('svelte').Snippet<[{hidden:boolean, x?:number, y?:number}]>)=>any}
     */
    const portalSubscriber = getContext(MENU_PORTAL_SUBSCRIBE);
    /**
     * @type {(name:string)=>any}
     */
    const portalUnsubscriber = getContext(MENU_PORTAL_UNSUBSCRIBE);

    /**
     * @type {(name:string, x?:number, y?:number)=>any}
     */
    const portalShow = getContext(MENU_DISPLAY);

    $effect(() => {
        portalSubscriber(name, renderer);
        return () => {
            portalUnsubscriber(name);
        };
    });

    const toggleMenu = () => {
        isOpen = !isOpen;
        portalShow(open ? name : undefined);
    };

    /**
     * @param {HTMLElement} el
     */
    const attach = (el) => {
        triggerRef = el;
        el.addEventListener("click", toggleMenu);

        return () => {
            triggerRef = undefined;
            el.removeEventListener("click", toggleMenu);
        };
    };
</script>

{@render trigger?.({ attach })}
{#snippet renderer({ hidden, x = undefined, y = undefined })}
    <DropdownMenuContent isOpen={hidden} {x} {y} {triggerRef} {name} {...props}>
        {@render content?.()}
    </DropdownMenuContent>
{/snippet}
