<script>
    import { t } from "@i18n/i18n.svelte";
    import { Search } from "@lucide/svelte";
    import Input from "@ui/Input/Input.svelte";

    /**
     * @typedef {Object} SearchBarProps
     * @prop {string} pattern
     */
    /** @type {SearchBarProps } */
    let { pattern = $bindable() } = $props();
</script>

<div class="px-4 pb-4 border-b border-border/50">
    <div class="relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
            type="search"
            placeholder={t("label.sidebar.search.placeholder")}
            class="pl-8 h-9"
            value={pattern}
            onValueChange={(v) => (pattern = v)}
        />
    </div>
</div>
