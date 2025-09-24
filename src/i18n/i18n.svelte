<script module>
    import { getLanguage } from "@context/SettingsContext.svelte";
    import { DEFAULT } from "./DEFAULT.svelte";
    import { ZH_CN } from "./ZH_CN.svelte";
    /**
     * @typedef {keyof DEFAULT} i18nlabel
     */

    const LANGUAGES = {
        "en-US": DEFAULT,
        "zh-CN": ZH_CN,
    };

    /**
     * @type {()=>{value:string, label:string}[]}
     */
    export const languages = () => [
        {
            label: t("label.system.default"),
            value: "system",
        },
        {
            label: "English",
            value: "en-US",
        },
        {
            label: "简体中文",
            value: "zh-CN",
        },
    ];

    /**
     * @param {i18nlabel} label
     * @param {any[]} args
     * @returns {string}
     */
    export const t = (label, ...args) => {
        const lang = getLanguage();
        let l = lang();
        if (l === "system") {
            l = navigator.language;
        }
        if (!Object.keys(LANGUAGES).includes(l)) {
            l = "en-US";
        }
        if (label.startsWith("template")) {
            return LANGUAGES[l][label]?.(...args) || label;
        }
        return LANGUAGES[l][label] || label;
    };
</script>
