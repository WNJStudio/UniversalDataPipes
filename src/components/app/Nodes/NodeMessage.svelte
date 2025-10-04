<script>
    /**
     * @typedef {Object} NodeMessageProps
     * @prop {string} [info]
     * @prop {string} [success]
     * @prop {string} [error]
     * @prop {string} [primary]
     * @prop {string} [mute]
     * @prop {import('svelte/elements').ClassValue} [textClass]
     */
    /** @type {NodeMessageProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { info, success, error, primary, mute, textClass, ...props } = $props();

    /**
     * @type {{type:"info"|"success"|"error"|"primary"|"mute", text:string}}
     */
    let message = $derived.by(() => {
        if (error && error !== "") {
            return { type: "error", text: error };
        }
        if (primary && primary !== "") {
            return { type: "primary", text: primary };
        }
        if (info && info !== "") {
            return { type: "info", text: info };
        }
        if (mute && mute !== "") {
            return { type: "mute", text: mute };
        }
        if (success && success !== "") {
            return { type: "success", text: success };
        }
        return { type: "info", text: "" };
    });

    let typeClass = $derived.by(() => {
        switch (message.type) {
            case "error":
                return "text-destructive font-bold";
            case "success":
                return "text-green-500";
            case "primary":
                return "text-primary font-bold";
            case "mute":
                return "text-muted-foreground";
            case "info":
                return "text-blue-300";
            default:
                return "";
        }
    });
</script>

<div {...props} class={["flex justify-center items-center", props.class]}>
    <span class={["text-center text-sm", typeClass, textClass]}>
        {message.text}
    </span>
</div>
