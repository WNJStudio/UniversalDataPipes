<script>
    import { t } from "@i18n/i18n.svelte";
    import NodeMessage from "../NodeMessage.svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();
</script>

<div
    class="flex-[1_1_0] overflow-y-auto custom-scrollbar-2 flex flex-col justify-center items-center"
>
    <NodeMessage
        class="flex-1"
        textClass="text-2xl font-bold"
        error={t("label.default")}
    />
</div>
