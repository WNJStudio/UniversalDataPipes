<script>
    import { t } from "@i18n/i18n.svelte";
    import { Download } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";
    import Dialog from "@ui/Dialog/Dialog.svelte";
    import DialogDescription from "@ui/Dialog/DialogDescription.svelte";
    import DialogFooter from "@ui/Dialog/DialogFooter.svelte";
    import DialogHeader from "@ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "@ui/Dialog/DialogTitle.svelte";
    import TextArea from "@ui/Input/TextArea.svelte";
    import Label from "@ui/Label/Label.svelte";

    /**
     * @typedef {Object} ImportExportDialogProps
     * @prop {string} [data]
     * @prop {boolean} isOpen
     * @prop {(c:Object)=>{success:number,failure:number}} [onImport]
     * @prop {()=>any} onClose
     * @prop {"import"|"export"} mode
     */
    /** @type {ImportExportDialogProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let {
        data = "",
        mode = "import",
        onClose,
        onImport,
        isOpen = $bindable(),
        ...props
    } = $props();
    let jsonData = $derived(data);
    let errorMessage = $state("");
    let successMessage = $state("");
    /**
     * @type {HTMLInputElement}
     */
    let fileInputRef = $state();

    const handleDownload = () => {
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pipelines.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /**
     *
     * @param {Event & {currentTarget:EventTarget & HTMLInputElement}} e
     */
    const handleFileUpload = async (e) => {
        errorMessage = "";
        const file = e.currentTarget.files?.[0];
        if (file) {
            const content = await file.text();
            jsonData = content;
            try {
                const result = onImport?.(JSON.parse(content));
                if (result.failure > 0) {
                    errorMessage = t(
                        "template.dialog.ie.message.error",
                        result.success,
                        result.failure,
                    );
                } else {
                    successMessage = t(
                        "template.dialog.ie.message.success",
                        result.success,
                    );
                }
            } catch (error) {
                errorMessage = `${error}`;
            }
        }
    };

    const handleImportClick = () => {
        if (jsonData.trim()) {
            try {
                const result = onImport?.(JSON.parse(jsonData));
                if (result.failure > 0) {
                    errorMessage = errorMessage = t(
                        "template.dialog.ie.message.error",
                        result.success,
                        result.failure,
                    );
                } else {
                    successMessage = t(
                        "template.dialog.ie.message.success",
                        result.success,
                    );
                }
            } catch (error) {
                errorMessage = `${error}`;
            }
        }
    };

    const triggerFileUpload = () => {
        fileInputRef?.click();
    };

    const handleCancel = () => {
        jsonData = "";
        errorMessage = "";
        successMessage = "";
        if (fileInputRef) {
            fileInputRef.value = "";
        }
        isOpen = false;
        onClose();
    };
</script>

<Dialog
    bind:isOpen
    class={["sm:max-w-md", props.class]}
    onClose={handleCancel}
    onCancel={handleCancel}
>
    {#snippet content()}
        <DialogHeader>
            <DialogTitle
                >{mode === "export"
                    ? t("label.dialog.ie.title.export")
                    : t("label.dialog.ie.title.import")}</DialogTitle
            >
            <DialogDescription>
                {mode === "export"
                    ? t("label.dialog.ie.description.export")
                    : t("label.dialog.ie.description.import")}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <Label for="json-data">{t("label.dialog.ie.text.label")}</Label>
            <TextArea
                id="json-data"
                value={jsonData}
                onValueChange={(v) => (jsonData = v)}
                readonly={mode === "export"}
                class={[
                    "h-64 font-mono text-xs resize-none",
                    errorMessage !== ""
                        ? "ring-destructive ring-2 ring-offset-2"
                        : "",
                ]}
                placeholder={mode !== "export"
                    ? t("label.dialog.ie.text.placeholder")
                    : ""}
            />
            {#if errorMessage !== ""}
                <span class="text-destructive font-semibold"
                    >{errorMessage}</span
                >
            {/if}
            {#if successMessage !== ""}
                <span class="text-accent font-semibold">{successMessage}</span>
            {/if}
        </div>
        <DialogFooter>
            {#if mode === "export"}
                <Button onclick={handleDownload}>
                    <Download class="h-5 w-5" />
                    {t("label.dialog.ie.download")}</Button
                >
            {:else}
                <input
                    type="file"
                    bind:this={fileInputRef}
                    onchange={handleFileUpload}
                    accept="application/json"
                    class="hidden"
                />
                <Button variant="outline" onclick={triggerFileUpload}
                    >{t("label.dialog.ie.upload")}</Button
                >
                <Button onclick={handleImportClick} disabled={!jsonData.trim()}
                    >{t("label.dialog.ie.importtext")}</Button
                >
            {/if}
        </DialogFooter>
    {/snippet}
</Dialog>
