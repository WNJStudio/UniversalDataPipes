<script>
    import { CloudUpload, FileIcon } from "@lucide/svelte";
    import { getContext } from "svelte";
    import Button from "../../../../../ui/Button/Button.svelte";
    import {
        PIPELINE_DATA_SETTER,
        PIPELINE_EDGES,
    } from "../../../../../../constants";
    import { EdgeData } from "../../../../../../model/Node.svelte";

    /**
     * @type {(edgeId:string,data:any)=>any}
     */
    const dataSetter = getContext(PIPELINE_DATA_SETTER);
    /**
     * @type {{[edgeId:string]:EdgeData}}
     */
    const edges = getContext(PIPELINE_EDGES);

    /**
     * @type {import('../NodeProps.svelte').NodeProps}
     */
    let { inputs, outputs } = $props();

    let fileInputRef = $state();
    let isDragging = $state(false);
    let filename = $state();
    let filesize = $state();

    /**
     * @type {EdgeData[]}
     */
    let myEdges = $derived.by(() => {
        if (edges) {
            return Object.values(edges).filter(
                (edge) =>
                    outputs?.[0]?.id?.includes?.(edge.start) ||
                    outputs?.[0]?.id?.includes?.(edge.end),
            );
        }
        return [];
    });

    const clearData = () => {
        filename = null;
        filesize = null;
        if (myEdges.length > 0) {
            myEdges.forEach((edge) => {
                dataSetter?.(edge.id, null);
            });
        }
    };

    /**
     * @param {File} file
     */
    const handleFileChange = async (file) => {
        if (file) {
            filename = file.name;
            filesize = file.size;
            const fileContent = await file.text();
            if (myEdges.length > 0) {
                myEdges.forEach((edge) => {
                    dataSetter?.(edge.id, fileContent);
                });
            }
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
    <div class="flex items-center space-x-2 p-2 bg-muted rounded-md">
        <FileIcon class="h-5 w-5 text-foreground" />
        <div class="flex-1 text-sm truncate">
            <p class="font-medium">{filename}</p>
            <p class="text-xs text-muted-foreground">
                {Math.round(filesize / 1024)} KB
            </p>
        </div>
        <Button size="sm" variant="ghost" onclick={clearData}>Clear</Button>
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
        ondragenter={handleDragEnter}
        ondragleave={handleDragLeave}
        ondragover={handleDragOver}
        ondrop={handleDrop}
        class={[
            "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md text-center",
            isDragging ? "border-primary bg-primary/10" : "border-border",
        ]}
    >
        <CloudUpload class="h-8 w-8 text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground mb-2">Drop a file or</p>
        <Button onclick={handleSelectFile} variant="outline" size="sm"
            >Select File</Button
        >
    </div>
{/if}
