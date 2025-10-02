<script>
    import { dataContext } from "@context/DataContext.svelte";
    import { pipelineContext } from "@context/PipelineContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import {
        EventStreamContentType,
        fetchEventSource,
    } from "@microsoft/fetch-event-source";
    import Button from "@ui/Button/Button.svelte";
    import Input from "@ui/Input/Input.svelte";
    import { onMount } from "svelte";

    /** @type {import('../NodeRegistry.svelte').NodeProps} */
    let { id } = $props();

    const abortController = new AbortController();

    const pipelineData = dataContext.get();

    const pipeline = pipelineContext.get();

    let node = $derived(pipeline.nodes[id]);

    /**
     * @type {"error"|"ready"|"url_invalid"|"waiting"|"sending"}
     */
    let status = $state();

    let errorMessage = $state("");

    let endpoint = $state("");

    let headersEdges = $derived(
        pipeline.getEdgesOfHandle(node?.inputs?.[0]?.id),
    );
    let bodyEdges = $derived(pipeline.getEdgesOfHandle(node?.inputs?.[1]?.id));

    let outputEdges = $derived(
        pipeline.getEdgesOfHandle(node?.outputs?.[0]?.id),
    );

    /**
     * @type {Object}
     */
    let headers = $derived.by(() => {
        if (headersEdges.length > 0 && pipelineData) {
            return pipelineData[headersEdges[0].id]?.[0];
        }
        return undefined;
    });

    /**
     * @type {Object}
     */
    let body = $derived.by(() => {
        if (bodyEdges.length > 0 && pipelineData) {
            return pipelineData[bodyEdges[0].id]?.[0];
        }
        return undefined;
    });

    /**
     * @type {Object[]}
     */
    let outputData = $state([]);

    $effect(() => {
        if (outputEdges.length > 0) {
            if (outputData.length > 0) {
                outputEdges.forEach((edge) => {
                    pipelineData[edge.id] = outputData;
                });
            } else {
                outputEdges.forEach((edge) => {
                    delete pipelineData[edge.id];
                });
            }
        }
    });

    onMount(() => {
        if (endpoint === "" && node.config.endpoint) {
            endpoint = node.config.endpoint;
            status = "ready";
        }
    });

    /**
     * @param {string} v
     */
    const setEndpoint = (v) => {
        endpoint = v;
        try {
            new URL(v);
            status = "ready";
            node.config.endpoint = v;
        } catch (error) {
            status = "url_invalid";
        }
    };

    const abortAndReset = () => {
        abortController.abort();
        status = "ready";
    };

    const connect = () => {
        outputData = [];
        fetchEventSource(endpoint, {
            signal: abortController.signal,
            headers,
            body: JSON.stringify(body),
            method: "POST",
            onerror: (e) => {
                throw e;
            },
            onopen: async (res) => {
                if (
                    res.ok &&
                    res.headers.get("content-type") === EventStreamContentType
                ) {
                    status = "waiting";
                    return;
                }
                throw new Error(`${res.status}: ${res.statusText}`);
            },
            onmessage: (msg) => {
                outputData.push(msg);
            },
            onclose: () => {
                status = "ready";
            },
        }).catch((e) => {
            errorMessage = e;
            status = "error";
        });
        status = "sending";
    };
</script>

<div class="flex-1 flex flex-col gap-4 min-h-48 justify-between">
    <Input
        placeholder={`${t("label.endpoint")}: http://...`}
        value={endpoint}
        onValueChange={setEndpoint}
    />
    <div
        class="flex-[1_1_0] flex flex-col gap-2 overflow-y-auto custom-scrollbar-2"
    >
        <div class="grid grid-cols-2 gap-2">
            <span
                class="bg-yellow-500 text-background px-2 text-center rounded-md text-sm"
            >
                {t("label.headers")}
            </span>
            <span class="text-muted-foreground text-sm">
                {#if headers}
                    {t("label.ready")}
                {:else}
                    {t("label.node.nodata")}
                {/if}
            </span>
            <span
                class="bg-yellow-500 text-background px-2 text-center rounded-md text-sm"
            >
                {t("label.body")}
            </span>
            <span class="text-muted-foreground text-sm">
                {#if body}
                    {t("label.ready")}
                {:else}
                    {t("label.node.nodata")}
                {/if}
            </span>
        </div>
        <div class="flex-1 flex justify-center items-center">
            <span class="text-center text-sm text-primary">
                {#if status === "url_invalid"}
                    {t("label.url.invalid")}
                {:else if status === "error"}
                    {errorMessage}
                {:else if status === "ready"}
                    {t("label.ready")}
                {:else if status === "sending"}
                    {t("label.sending")}
                {:else if status === "waiting"}
                    {t("label.sse.waiting")}
                {:else}
                    {t("label.url.insert")}
                {/if}
            </span>
        </div>
    </div>
    <div class="flex gap-2 justify-between items-center">
        <Button
            disabled={status !== "waiting" && status !== "error"}
            class="flex-1"
            variant="outline"
            onclick={abortAndReset}
        >
            {#if status === "error"}
                {t("label.reset")}
            {:else}
                {t("label.stop")}
            {/if}
        </Button>
        <Button disabled={status !== "ready"} class="flex-1" onclick={connect}>
            {t("label.send")}
        </Button>
    </div>
</div>
