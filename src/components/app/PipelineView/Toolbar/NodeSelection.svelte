<script>
    import { Search } from "@lucide/svelte";
    import Card from "../../../ui/Card/Card.svelte";
    import FlyOut from "../../../ui/Transitions/FlyOut.svelte";
    import Input from "../../../ui/Input/Input.svelte";
    import { fade } from "svelte/transition";
    import Tooltip from "../../../ui/Tooltip/Tooltip.svelte";
    import { NodeDefinition, NodeDefs } from "../../../../model/Node.svelte";

    /**
     * @typedef {Object} NodeSelectionProps
     * @prop {string} activeCategory
     * @prop {string} pattern
     * @prop {()=>any} spawnNode
     */
    /** @type {NodeSelectionProps} */
    let { activeCategory, pattern = $bindable(), spawnNode } = $props();
    let query = $derived(new RegExp(pattern, "i"));

    let filteredNodes = $derived(
        NodeDefs[activeCategory]?.nodes?.filter?.((n) => query.test(n.name)) ||
            [],
    );
</script>

<FlyOut hidden={activeCategory === "" || !activeCategory} y="100%">
    <Card class="bg-card/90 backdrop-blur-xs w-full max-w-[50vw]">
        <div class="p-2">
            <div class="flex items-center gap-2 my-2 px-2">
                <Search class="h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search nodes..."
                    class="h-8 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={pattern}
                    onValueChange={(v) => (pattern = v)}
                />
            </div>
            <div class="overflow-x-auto custom-scrollbar">
                <div
                    class={[
                        "flex items-center gap-2 pb-2",
                        filteredNodes.length > 0 ? "w-max" : "",
                    ]}
                >
                    {#if filteredNodes.length === 0}
                        <p
                            class="text-sm text-muted-foreground text-center w-full py-4"
                        >
                            No nodes found.
                        </p>
                    {/if}
                    {#each filteredNodes as node (node.name)}
                        <div transition:fade>
                            <Tooltip>
                                {#snippet content()}
                                    <p>{node.name}</p>
                                {/snippet}
                                {#snippet trigger({ attach })}
                                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                                    <div
                                        {@attach attach}
                                        data-template-category={activeCategory}
                                        data-template-name={node.name}
                                        onmousedown={spawnNode}
                                        class="flex flex-col items-center justify-center p-2 rounded-md cursor-grab hover:bg-accent hover:text-accent-foreground w-24 h-20 border border-transparent hover:border-primary transition-colors"
                                    >
                                        <node.icon
                                            class="h-6 w-6 mb-1 text-primary"
                                        />
                                    </div>
                                {/snippet}
                            </Tooltip>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </Card>
</FlyOut>
