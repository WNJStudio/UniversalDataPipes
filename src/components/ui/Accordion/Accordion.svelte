<script>
    import { accordionContext } from "./AccordionContext.svelte";

    /**
     * @typedef {Object} AccordionProps
     * @prop {"single"|"multiple"} [type]
     * @prop {string[]} values
     * @prop {(v:string[])=>void} [onValuesChange]
     */
    /** @type {AccordionProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        type = "single",
        values = $bindable(),
        onValuesChange,
        ...props
    } = $props();
    /**
     * @param {string} v
     */
    const handleToggle = (v) => {
        let newValue = [];
        if (type === "multiple") {
            newValue = values.includes(v)
                ? values.filter((vv) => vv !== v)
                : [...values, v];
        } else {
            newValue = values.length > 0 ? [] : [v];
        }
        if (onValuesChange) {
            onValuesChange(newValue);
        } else {
            values = newValue;
        }
    };

    accordionContext.set({
        values: () => values,
        getHandleToggle: () => handleToggle,
    });
</script>

<div {...props} class={["", props.class]}>
    {@render props.children?.()}
</div>
