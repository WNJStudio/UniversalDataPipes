<script>
    import { t } from "@i18n/i18n.svelte";
    import { Search } from "@lucide/svelte";
    import Input from "@ui/Input/Input.svelte";

    /**
     * @typedef {Object} LibrarySearchBarProps
     * @prop {string} pattern
     */
    /** @type {LibrarySearchBarProps } */
    let { pattern = $bindable() } = $props();
</script>

<div class="px-4 pt-4">
    <div class="relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            type="search"
            placeholder={t("label.library.search.placeholder")}
            class="pl-8 h-9"
            value={pattern}
            onValueChange={(v) => (pattern = v)}
        />
    </div>
</div>
