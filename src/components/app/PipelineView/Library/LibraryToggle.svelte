<script>
    import { Book, BookOpen } from "@lucide/svelte";
    import Button from "@ui/Button/Button.svelte";

    import {
        getCurrentView,
        getLibraryStatus,
        getLibraryToggler,
        PIPEVIEW,
    } from "@context/SettingsContext.svelte";
    import { t } from "@i18n/i18n.svelte";
    import { fly } from "svelte/transition";
    const libraryToggler = getLibraryToggler();
    const libraryStatus = getLibraryStatus();
    const currentView = getCurrentView();
</script>

{#if currentView() === PIPEVIEW}
    <div
        transition:fly={{ x: "100%" }}
        class={[
            "absolute z-50 top-2 right-2 transition-[translate,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke]",
            libraryStatus() ? "-translate-x-64" : "",
        ]}
    >
        <Button
            tooltipSide="bottom"
            size="icon"
            variant="floating"
            delay={500}
            toggle
            toggleStatus={libraryStatus()}
            onclick={() => libraryToggler()}
            class={["h-8 w-8", libraryStatus() ? "text-primary/90" : ""]}
        >
            {#snippet tooltip()}
                <span class="text-xs font-normal"
                    >{libraryStatus()
                        ? t("label.library.collapse")
                        : t("label.library.expand")}</span
                >
            {/snippet}
            {#snippet toggleOn()}
                <BookOpen class="h-5 w-5" />
            {/snippet}
            {#snippet toggleOff()}
                <Book class="h-5 w-5" />
            {/snippet}
        </Button>
    </div>
{/if}
