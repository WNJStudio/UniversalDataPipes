<script>
    /**
     * @typedef {Object} SliderProps
     * @prop {number} value
     * @prop {number} min
     * @prop {number} max
     * @prop {number} [step]
     * @prop {(v:number)=>void} [valueChanger]
     * @prop {boolean} [disabled]
     */
    /** @type {SliderProps & import('svelte/elements').SvelteHTMLElements['']} */
    let {
        disabled = false,
        value = $bindable(),
        valueChanger,
        min = 0,
        max = 999,
        step = 1,
        ...props
    } = $props();

    let isDragging = $state(false);
    /**
     * @type {HTMLElement}
     */
    let ref = $state();

    /**
     * @param {number} v
     */
    const getPercentage = (v) => {
        return ((v - min) / (max - min)) * 100;
    };

    /**
     * @param {number} p
     */
    const getValueFromPosition = (p) => {
        const { width } = ref?.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, p / width));
        const rawValue = min + percentage * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
    };

    /**
     * @param {MouseEvent} e
     */
    const handleMouseDown = (e) => {
        if (disabled || !ref) return;
        const rect = ref.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const position = clientX - rect.left;
        const newValue = getValueFromPosition(position);
        if (valueChanger) {
            valueChanger(newValue);
        } else {
            value = newValue;
        }
        isDragging = true;
    };
    /**
     * @param {MouseEvent} e
     */
    const handleMouseMove = (e) => {
        if (!isDragging || !ref) return;
        const rect = ref.getBoundingClientRect();
        const position = e.clientX - rect.left;
        const newValue = getValueFromPosition(position);
        if (valueChanger) {
            valueChanger(newValue);
        } else {
            value = newValue;
        }
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    $effect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    });
</script>

<div
    bind:this={ref}
    onmousedown={handleMouseDown}
    class={[
        "relative flex w-full touch-none select-none items-center",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        props.class,
    ]}
    {...props}
>
    <div
        class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    >
        <div
            class="absolute h-full bg-primary"
            style={`width: ${getPercentage(value)}%`}
        ></div>
    </div>
    <div
        class={[
            "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
            "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
        ]}
        style={`left: calc(${getPercentage(value)}% - 10px)`}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
    ></div>
</div>
