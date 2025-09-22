<script>
    import { v4 } from "uuid";

    import {
        getTooltipDisplayer,
        getTooltipSubscriber,
        getTooltipUnubscriber,
    } from "../../../portals/TooltipPortal.svelte";
    import TooltipContent from "./TooltipContent.svelte";

    /**
     * @typedef {Object} TooltipProps
     * @prop {import('svelte').Snippet} content
     * @prop {import('svelte').Snippet<[{attach:import('svelte/attachments').Attachment}]>} trigger
     * @prop {"top"|"bottom"|"left"|"right"} [preferredSide]
     * @prop {number} [sideOffset]
     * @prop {number} [delay]
     * @prop {number} [duration]
     * @prop {boolean} [isOpen]
     * @prop {"start"|"center"|"end"} [align]
     */
    /** @type {TooltipProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { content, trigger, delay = 300, ...props } = $props();

    let timer = $state();
    let isOpen = $state(false);
    let triggerRef = $state();
    let id = $state(v4());

    const portalSubscriber = getTooltipSubscriber();

    const portalUnsubscriber = getTooltipUnubscriber();

    const portalShow = getTooltipDisplayer();

    $effect(() => {
        portalSubscriber(id, renderer);
        return () => {
            portalUnsubscriber(id);
        };
    });

    const startTimer = () => {
        if (!timer) {
            timer = setTimeout(() => {
                isOpen = true;
                portalShow(id);
            }, delay);
        }
    };

    const stopTimer = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
        isOpen = false;
        portalShow(undefined);
    };

    /**
     * @param {HTMLElement} el
     */
    const attach = (el) => {
        triggerRef = el;
        el.addEventListener("mouseenter", startTimer);
        el.addEventListener("mouseleave", stopTimer);

        return () => {
            triggerRef = undefined;
            el.removeEventListener("mouseenter", startTimer);
            el.removeEventListener("mouseleave", stopTimer);
        };
    };
</script>

{@render trigger?.({ attach })}
{#snippet renderer({ hidden })}
    <TooltipContent isOpen={hidden} {triggerRef} {...props}>
        {@render content?.()}
    </TooltipContent>
{/snippet}
