<script>
    import {
        getLanguage,
        getLanguageChanger,
    } from "../../../context/SettingsContext.svelte";
    import { languages, t } from "../../../i18n/i18n.svelte";
    import Select from "../../ui/Select/Select.svelte";
    import FlyOut from "../../ui/Transitions/FlyOut.svelte";

    /**
     * @typedef {Object} GeneralTabProps
     * @prop {boolean} hidden
     */
    /** @type {GeneralTabProps } */
    let { hidden } = $props();

    const changeLanguage = getLanguageChanger();
    const lang = getLanguage();
</script>

<FlyOut {hidden} y="100%" class="grid gap-6 py-4">
    <div class="flex items-center justify-between">
        <div class="flex flex-col space-y-1">
            <span>{t("label.settings.language")}</span>
            <span
                class="text-xs font-normal leading-snug text-muted-foreground"
            >
                {t("label.settings.language.description")}
            </span>
        </div>
        <Select
            name="lang"
            value={lang()}
            valueSetter={changeLanguage}
            items={languages()}
            class="sm:w-xs w-48"
        />
    </div>
</FlyOut>
