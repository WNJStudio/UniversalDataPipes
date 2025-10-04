<script>
    import {
        getCurrentView,
        getLibraryStatus,
        getLibraryToggler,
        PIPEVIEW,
    } from "@context/SettingsContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { NodeDefs } from "@model/NodeCategory.svelte";
    import Accordion from "@ui/Accordion/Accordion.svelte";
    import AccordionItem from "@ui/Accordion/AccordionItem.svelte";
    import ScrollArea from "@ui/ScrollArea/ScrollArea.svelte";
    import { smoothScale } from "@ui/Transitions/SmoothScale.svelte";
    import { fly } from "svelte/transition";
    import LibrarySearchBar from "./LibrarySearchBar.svelte";
    import LibraryToggle from "./LibraryToggle.svelte";

    /**
     * @typedef {Object} CategoryFiltered
     * @prop {string} name
     * @prop {import('@i18n/i18n.svelte').i18nlabel} label
     * @prop {import('@model/NodeDefinition.svelte').NodeDefinition[]} nodefs
     */

    /**
     * @typedef {Object} LibraryProps
     * @prop {(e: MouseEvent) => void} onLibraryDrag
     */
    /** @type {LibraryProps & import('svelte/elements').SvelteHTMLElements['div']} */
    let { onLibraryDrag, ...props } = $props();
    const libraryStatus = getLibraryStatus();
    const libraryToggler = getLibraryToggler();
    const currentView = getCurrentView();
    /**
     * @type {string[]}
     */
    let openCategories = $state(Object.keys(NodeDefs));
    let hidden = $derived(!libraryStatus() || currentView() !== PIPEVIEW);
    let pattern = $state("");
    let query = $derived.by(() => {
        try {
            return new RegExp(pattern, "i");
        } catch (error) {
            return new RegExp("", "i");
        }
    });

    /**
     * @type {CategoryFiltered[]}
     */
    const categories = $derived.by(() => {
        /**
         * @type {CategoryFiltered[]}
         */
        const defs = [];
        Object.values(NodeDefs).forEach((cat) => {
            const nodefs = cat.nodes.filter(
                (nodef) =>
                    query.test(nodef.category) ||
                    query.test(nodef.name) ||
                    query.test(t(nodef.name)) ||
                    query.test(t(cat.label)),
            );
            if (nodefs.length > 0) {
                defs.push({ label: cat.label, name: cat.name, nodefs });
            }
        });

        return defs;
    });

    /**
     * @param {KeyboardEvent} e
     */
    const onkeydown = (e) => {
        if (e.key === "`") {
            e.preventDefault();
            libraryToggler();
        }
    };
    /**
     * @param {MouseEvent} e
     */
    const oncontextmenu = (e) => {
        if (e.target instanceof HTMLElement) {
            if (
                e.target.nodeName === "INPUT" ||
                e.target.nodeName === "TEXTAREA"
            ) {
                return;
            }
        }
        e.preventDefault();
    };
</script>

{#if !hidden}
    <div
        transition:fly={{ x: "100%" }}
        role="complementary"
        tabindex="-1"
        {oncontextmenu}
        class={[
            "absolute right-0 z-50 bg-sidebar/75 w-64 border-l border-border/50 flex flex-col h-full",
            props.class,
        ]}
    >
        <div class="p-4 border-b border-border/50">
            <h2 class="text-lg font-semibold">{t("label.library")}</h2>
            <p class="text-sm text-muted-foreground">
                {t("label.drag.hint")}
            </p>
        </div>
        <LibrarySearchBar bind:pattern />
        <ScrollArea class="flex-1 min-h-0">
            <Accordion type="multiple" bind:values={openCategories} class="p-4">
                {#each categories as category (category.name)}
                    <div transition:smoothScale={{ axis: "height" }}>
                        <AccordionItem
                            value={category.name}
                            label={t(category.label)}
                        >
                            <div class="grid grid-cols-2 gap-2 pt-2">
                                {#each category.nodefs as nodef}
                                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                                    <div
                                        transition:smoothScale={{}}
                                        data-template-category={category.name}
                                        data-template-name={nodef.name}
                                        onmousedown={onLibraryDrag}
                                        class={[
                                            "flex flex-col items-center justify-center p-2 rounded-md cursor-grab",
                                            "hover:bg-accent text-muted-foreground hover:text-accent-foreground w-24 h-20 border border-transparent hover:border-primary transition-colors",
                                        ]}
                                    >
                                        <nodef.icon
                                            class="h-6 w-6 mb-1 text-primary"
                                        />
                                        <p class="text-xs text-center">
                                            {t(nodef.name)}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </AccordionItem>
                    </div>
                {/each}
            </Accordion>
            {#if categories.length === 0}
                <div
                    transition:smoothScale={{ axis: "height" }}
                    class="text-center text-sm text-muted-foreground py-10"
                >
                    <p>{t("label.library.search.notfound")}</p>
                </div>
            {/if}
        </ScrollArea>
    </div>
{/if}
<LibraryToggle />

<svelte:window {onkeydown} />
