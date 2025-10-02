<script>
    import { t } from "@i18n/i18n.svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();
</script>

<p class="text-muted-foreground text-2xl font-body">{t("label.default")}</p>
