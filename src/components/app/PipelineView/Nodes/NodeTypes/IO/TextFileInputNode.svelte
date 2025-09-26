<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { CloudUpload, FileIcon } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    /**
     * @type {import('../NodeProps.svelte').NodeProps}
     */
    let { inputs, outputs } = $props();

    let fileInputRef = $state();
    let isDragging = $state(false);
    let filename = $state();
    let filesize = $state();
    let fileContent = $state();

    let myEdges = $derived(pipeline.getEdgesOfHandle(outputs?.[0]?.id));

    const clearData = () => {
        filename = null;
        filesize = null;
        fileContent = null;
        if (myEdges.length > 0) {
            myEdges.forEach((edge) => {
                delete pipelineData[edge.id];
            });
        }
    };

    $effect(() => {
        if (myEdges.length > 0 && fileContent) {
            myEdges.forEach((edge) => {
                pipelineData[edge.id] = fileContent;
            });
        }
    });

    /**
     * @param {File} file
     */
    const handleFileChange = async (file) => {
        if (file) {
            filename = file.name;
            filesize = file.size;
            fileContent = await file.text();
        }
    };

    /**
     * @param {Event & {currentTarget:EventTarget & HTMLInputElement}} e
     */
    const onFileChange = (e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            handleFileChange(e.currentTarget.files[0]);
        }
    };
    /**
     * @param {DragEvent} e
     */
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
    };
    /**
     * @param {DragEvent} e
     */
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target instanceof Element) {
            if (e.target.closest("[data-node-file-input]")) {
                return;
            }
        }
        isDragging = false;
    };
    /**
     * @param {DragEvent} e
     */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    /**
     * @param {DragEvent} e
     */
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = false;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    const handleSelectFile = (e) => {
        fileInputRef?.click?.();
    };
</script>

{#if filename}
    <div class="flex flex-1 items-center space-x-2 p-2 bg-muted rounded-md">
        <FileIcon class="h-5 w-5 text-foreground" />
        <div class="flex-1 text-sm truncate">
            <p class="font-medium truncate">{filename}</p>
            <p class="text-xs text-muted-foreground">
                {Math.round(filesize / 1024)} KB
            </p>
        </div>
        <Button size="sm" variant="ghost" onclick={clearData}
            >{t("label.clear")}</Button
        >
    </div>
{:else}
    <input
        bind:this={fileInputRef}
        type="file"
        class="hidden"
        onchange={onFileChange}
    />
    <div
        role="directory"
        data-node-file-input="true"
        ondragenter={handleDragEnter}
        ondragleave={handleDragLeave}
        ondragover={handleDragOver}
        ondrop={handleDrop}
        class={[
            "flex flex-col flex-1 items-center justify-center p-4 border-2 border-dashed rounded-md text-center",
            isDragging ? "border-primary bg-primary/10" : "border-border",
        ]}
    >
        <CloudUpload class="h-8 w-8 text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground mb-2">
            {t("label.file.drop.or")}
        </p>
        <Button onclick={handleSelectFile} variant="outline" size="sm"
            >{t("label.file.select")}</Button
        >
    </div>
{/if}
