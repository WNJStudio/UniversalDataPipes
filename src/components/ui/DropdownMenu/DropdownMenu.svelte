<script>
    import {
        getMenuDisplayer,
        getMenuSubscriber,
        getMenuUnubscriber,
    } from "@portal/MenuPortal.svelte";
    import DropdownMenuContent from "./DropdownMenuContent.svelte";
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

    const portalSubscriber = getMenuSubscriber();

    const portalUnsubscriber = getMenuUnubscriber();

    const portalShow = getMenuDisplayer();

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
