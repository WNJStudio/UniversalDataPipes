<script>
    import { Download } from "@lucide/svelte";
    import Button from "../../ui/Button/Button.svelte";
    import Dialog from "../../ui/Dialog/Dialog.svelte";
    import DialogDescription from "../../ui/Dialog/DialogDescription.svelte";
    import DialogFooter from "../../ui/Dialog/DialogFooter.svelte";
    import DialogHeader from "../../ui/Dialog/DialogHeader.svelte";
    import DialogTitle from "../../ui/Dialog/DialogTitle.svelte";
    import TextArea from "../../ui/Input/TextArea.svelte";
    import Label from "../../ui/Label/Label.svelte";

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
                    errorMessage = `Imported: ${result.success} - Failed: ${result.failure}`;
                } else {
                    successMessage = `Imported: ${result.success}`;
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
                    errorMessage = `Imported: ${result.success} - Failed: ${result.failure}`;
                } else {
                    successMessage = `Imported: ${result.success}`;
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
                    ? "Export Pipelines"
                    : "Import Pipelines"}</DialogTitle
            >
            <DialogDescription>
                {mode === "export"
                    ? "Copy the JSON below or download it as a file."
                    : "Paste JSON here or upload a file to import pipelines. Pipelines with the same name will be overridden."}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <Label for="json-data">Pipeline Data (JSON)</Label>
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
                placeholder={mode !== "export" ? "Paste your JSON here..." : ""}
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
                    Download File</Button
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
                    >Upload File</Button
                >
                <Button onclick={handleImportClick} disabled={!jsonData.trim()}
                    >Import from Text</Button
                >
            {/if}
        </DialogFooter>
    {/snippet}
</Dialog>
