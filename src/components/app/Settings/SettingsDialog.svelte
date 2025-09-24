<script>
    import { getLastSavedSince } from "@context/SettingsContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import Dialog from "@ui/Dialog/Dialog.svelte";
    import DialogDescription from "@ui/Dialog/DialogDescription.svelte";
    import DialogHeader from "@ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "@ui/Dialog/DialogTitle.svelte";
    import Separator from "@ui/Separator/Separator.svelte";
    import TabList from "@ui/Tabs/TabList.svelte";
    import AppearanceTab from "./AppearanceTab.svelte";
    import GeneralTab from "./GeneralTab.svelte";
    import GridTab from "./GridTab.svelte";

    /**
     * @typedef {Object} SettingsDialogProps
     * @prop {boolean} isOpen
     */
    /** @type {SettingsDialogProps & import('svelte/elements').SvelteHTMLElements['']} */
    let { isOpen = $bindable(), ...props } = $props();
    const GENERAL_TAB = $derived({
        value: "general",
        label: t("label.settings.general"),
    });
    const GRID_TAB = $derived({
        value: "grid",
        label: t("label.settings.grid"),
    });
    const APPEARANCE_TAB = $derived({
        value: "appearance",
        label: t("label.settings.appearance"),
    });

    const lastSavedSince = getLastSavedSince();

    const handleCancel = () => {
        isOpen = false;
    };

    let currentTab = $state("general");
    /**
     * @param {string} v
     */
    const changeTab = (v) => {
        currentTab = v;
    };
</script>

<Dialog
    class={["sm:max-w-xl md:max-w-2xl lg:max-w-3xl", props.class]}
    bind:isOpen
    onCancel={handleCancel}
    onClose={handleCancel}
>
    {#snippet content()}
        <DialogHeader>
            <DialogTitle>{t("label.settings")}</DialogTitle>
            <DialogDescription>
                {t("label.settings.description")}
            </DialogDescription>
        </DialogHeader>
        <div class="flex items-center gap-2">
            <TabList
                currentValue={currentTab}
                changer={changeTab}
                tabs={[GENERAL_TAB, GRID_TAB, APPEARANCE_TAB]}
            />
        </div>
        <div class="grid gap-6 py-4">
            <GeneralTab hidden={currentTab !== GENERAL_TAB.value} />
            <GridTab hidden={currentTab !== GRID_TAB.value} />
            <AppearanceTab hidden={currentTab !== APPEARANCE_TAB.value} />
            <Separator />
            <div class="grid gap-4">
                <span
                    class="text-xs font-normal leading-snug text-muted-foreground"
                    >{lastSavedSince()}</span
                >
            </div>
        </div>
    {/snippet}
</Dialog>
