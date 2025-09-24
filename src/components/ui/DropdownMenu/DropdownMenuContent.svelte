<script>
    import { ElementRect, onClickOutside } from "runed";
    /**
     * @typedef {Object} DropdownMenuContentProps
     * @prop {boolean} isOpen
     * @prop {string} name
     * @prop {number} [x]
     * @prop {number} [y]
     * @prop {number} [sideOffset]
     * @prop {HTMLElement} [triggerRef]
     */

    import { fly } from "svelte/transition";
    import { getMenuDisplayer } from "@portal/MenuPortal.svelte";
    import { getOpposite } from "../Sides.svelte";

    /** @type {DropdownMenuContentProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        isOpen = $bindable(),
        x,
        y,
        triggerRef,
        name,
        sideOffset = 4,
        ...props
    } = $props();

    const showMenu = getMenuDisplayer();

    /**
     * @type {HTMLElement}
     */
    let contentRef = $state();

    const contentRect = new ElementRect(() => contentRef);

    onClickOutside(
        () => contentRef,
        () => {
            showMenu(undefined);
        },
    );

    let position = $derived.by(() => {
        let left = 0;
        let top = 0;
        /**
         * @type {import('../Sides.svelte').Sides}
         */
        let finalSide = "bottom";
        if (x !== undefined && y !== undefined && contentRef) {
            const triggerRect = { top: y, left: x, bottom: y, right: x };
            /**
             * @param {import('../Sides.svelte').Sides} side
             */
            const calculatePosition = (side) => {
                let tempTop = 0,
                    tempLeft = 0;

                switch (side) {
                    case "top":
                        tempTop =
                            triggerRect.top - contentRect.height - sideOffset;
                        break;
                    case "bottom":
                        tempTop = triggerRect.bottom + sideOffset;
                        break;
                    case "left":
                        tempLeft =
                            triggerRect.left - contentRect.width - sideOffset;
                        break;
                    case "right":
                        tempLeft = triggerRect.right + sideOffset;
                        break;
                }

                if (side === "top" || side === "bottom") {
                    tempLeft = triggerRect.left;
                } else if (side === "left" || side === "right") {
                    tempTop = triggerRect.top;
                }
                return { top: tempTop, left: tempLeft };
            };

            const padding = 8;
            const { innerWidth, innerHeight } = window;

            let pos = calculatePosition("bottom");

            // Collision detection and flipping
            const collisions = {
                top: pos.top < padding,
                bottom: pos.top + contentRect.height > innerHeight - padding,
                left: pos.left < padding,
                right: pos.left + contentRect.width > innerWidth - padding,
            };

            if (collisions["bottom"]) {
                finalSide = getOpposite("bottom");
                pos = calculatePosition(finalSide);
            }
            if (pos.left < padding) pos.left = padding;
            if (pos.top < padding) pos.top = padding;
            if (pos.left + contentRect.width > innerWidth - padding)
                pos.left = innerWidth - contentRect.width - padding;
            if (pos.top + contentRect.height > innerHeight - padding)
                pos.top = innerHeight - contentRect.height - padding;

            left = pos.left + window.scrollX;
            top = pos.top + window.scrollY;
            return { left, top, side: finalSide };
        }
        if (triggerRef && contentRect) {
            const triggerRect = triggerRef.getBoundingClientRect();
            /**
             * @param {import('../Sides.svelte').Sides} side
             */
            const calculatePosition = (side) => {
                let tempTop = 0,
                    tempLeft = 0;

                switch (side) {
                    case "top":
                        tempTop =
                            triggerRect.top - contentRect.height - sideOffset;
                        break;
                    case "bottom":
                        tempTop = triggerRect.bottom + sideOffset;
                        break;
                    case "left":
                        tempLeft =
                            triggerRect.left - contentRect.width - sideOffset;
                        break;
                    case "right":
                        tempLeft = triggerRect.right + sideOffset;
                        break;
                }

                if (side === "top" || side === "bottom") {
                    tempLeft = triggerRect.left;
                } else if (side === "left" || side === "right") {
                    tempTop = triggerRect.top;
                }
                return { top: tempTop, left: tempLeft };
            };

            const padding = 8;
            const { innerWidth, innerHeight } = window;

            let pos = calculatePosition("bottom");

            // Collision detection and flipping
            const collisions = {
                top: pos.top < padding,
                bottom: pos.top + contentRect.height > innerHeight - padding,
                left: pos.left < padding,
                right: pos.left + contentRect.width > innerWidth - padding,
            };

            if (collisions["bottom"]) {
                finalSide = getOpposite("bottom");
                pos = calculatePosition(finalSide);
            }
            if (pos.left < padding) pos.left = padding;
            if (pos.top < padding) pos.top = padding;
            if (pos.left + contentRect.width > innerWidth - padding)
                pos.left = innerWidth - contentRect.width - padding;
            if (pos.top + contentRect.height > innerHeight - padding)
                pos.top = innerHeight - contentRect.height - padding;

            left = pos.left + window.scrollX;
            top = pos.top + window.scrollY;
        }
        return { left, top, side: finalSide };
    });
</script>

{#if isOpen}
    <div
        transition:fly
        class={["fixed z-50 min-w-max inline-block text-left"]}
        style={`top: ${position.top}px; left: ${position.left}px;`}
    >
        <div
            data-menu={name}
            {...props}
            bind:this={contentRef}
            class={[
                "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none pointer-events-auto",
                props.class,
            ]}
        >
            {@render props.children?.()}
        </div>
    </div>
{/if}
