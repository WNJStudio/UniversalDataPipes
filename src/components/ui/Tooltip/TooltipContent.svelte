<script>
    /** @type {{[x:string]:"top"|"bottom"|"left"|"right"}}*/
    const oppositeSide = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
    };
    /**
     * @typedef {Object} TooltipContentProps
     * @prop {"top"|"bottom"|"left"|"right"} [preferredSide]
     * @prop {number} [sideOffset]
     * @prop {number} [duration]
     * @prop {boolean} isOpen
     * @prop {"start"|"center"|"end"} [align]
     * @prop {HTMLElement} [triggerRef]
     */

    import FlyOut from "../Transitions/FlyOut.svelte";

    /** @type {TooltipContentProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        preferredSide = "top",
        sideOffset = 4,
        align = "center",
        isOpen,
        duration,
        triggerRef,
        ...props
    } = $props();

    let contentRef = $state();

    let position = $derived.by(() => {
        let left = 0;
        let top = 0;
        let finalSide = preferredSide;
        if (triggerRef && contentRef) {
            const triggerRect = triggerRef.getBoundingClientRect();
            const contentRect = contentRef.getBoundingClientRect();
            /**
             * @param {"top"|"bottom"|"left"|"right"} side
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
                    switch (align) {
                        case "start":
                            tempLeft = triggerRect.left;
                            break;
                        case "end":
                            tempLeft = triggerRect.right - contentRect.width;
                            break;
                        case "center":
                        default:
                            tempLeft =
                                triggerRect.left +
                                triggerRect.width / 2 -
                                contentRect.width / 2;
                            break;
                    }
                } else if (side === "left" || side === "right") {
                    switch (align) {
                        case "start":
                            tempTop = triggerRect.top;
                            break;
                        case "end":
                            tempTop = triggerRect.bottom - contentRect.height;
                            break;
                        case "center":
                        default:
                            tempTop =
                                triggerRect.top +
                                triggerRect.height / 2 -
                                contentRect.height / 2;
                            break;
                    }
                }
                return { top: tempTop, left: tempLeft };
            };

            const padding = 8;
            const { innerWidth, innerHeight } = window;

            let pos = calculatePosition(preferredSide);

            // Collision detection and flipping
            const collisions = {
                top: pos.top < padding,
                bottom: pos.top + contentRect.height > innerHeight - padding,
                left: pos.left < padding,
                right: pos.left + contentRect.width > innerWidth - padding,
            };

            if (collisions[preferredSide]) {
                finalSide = oppositeSide[preferredSide];
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

<FlyOut
    hidden={!isOpen}
    x={position.side === "left"
        ? "-50%"
        : position.side === "right"
          ? "50%"
          : undefined}
    y={position.side === "top"
        ? "-50%"
        : position.side === "bottom"
          ? "50%"
          : undefined}
    class={[
        "absolute z-50",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
        props.class,
    ]}
    {duration}
    style={`left: ${position.left}px; top: ${position.top}px`}
>
    <div
        bind:this={contentRef}
        class="overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
    >
        {@render props.children?.()}
    </div>
</FlyOut>
