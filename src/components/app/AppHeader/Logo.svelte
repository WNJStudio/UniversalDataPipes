<script>
    import { t } from "@i18n/i18n.svelte";
    import { Workflow } from "@lucide/svelte";
</script>

<Workflow class="h-6 w-6 text-primary" />
<h1 class="text-xl font-bold text-foreground select-none">
    {t("label.app.name")}
</h1>
