<script>
    /**
     * @typedef {Object} InputProps
     * @prop {number} [delay]
     * @prop {(v:any)=>any} onValueChange
     */
    /** @type {InputProps & import('svelte/elements').HTMLInputAttributes} */
    let { delay = 300, onValueChange, ...props } = $props();
    let lastInput = $state(Date.now());
    /**
     * @param {HTMLInputElement} el
     */
    const changeValueDelayed = (el) => {
        let delayCheck = undefined;
        let lastValue = el.value;
        /**
         * @param {InputEvent} _
         */
        const onInput = (_) => {
            lastInput = Date.now();
            if (delayCheck) {
                clearTimeout(delayCheck);
                delayCheck = undefined;
            }
            delayCheck = setTimeout(() => {
                if (Date.now() - lastInput > delay && lastValue !== el.value) {
                    onValueChange(el.value);
                    lastValue = el.value;
                }
            }, delay);
        };

        el.addEventListener("input", onInput);

        return () => {
            el.removeEventListener("input", onInput);
            if (delayCheck) {
                clearTimeout(delayCheck);
            }
        };
    };
</script>

<input
    {...props}
    {@attach changeValueDelayed}
    class={[
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        props.class,
    ]}
/>
