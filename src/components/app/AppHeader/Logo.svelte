<script>
    import { t } from "@i18n/i18n.svelte";
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 text-primary"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    fill="none"
>
    <rect x="18" y="2" width="4" height="4" rx="0.75" />
    <path d="M14 4 H 18" />
    <rect x="10" y="2" width="4" height="4" rx="0.75" />
    <path d="M 4 18 V 10 M 4 10 c 0 -7 -1 -6 6 -6" />
    <rect x="18" y="10" width="4" height="4" rx="0.75" />
    <path d="M 12 18 C 12 11 11 12 18 12" />
    <rect x="2" y="18" width="4" height="4" rx="0.75" />
    <path d="M6 20 H 10" />
    <rect x="10" y="18" width="4" height="4" rx="0.75" />
    <path d="M14 20 H 18" />
    <rect x="18" y="18" width="4" height="4" rx="0.75" />
</svg>
<h1 class="text-xl font-bold text-foreground select-none">
    {t("label.app.name")}
</h1>
