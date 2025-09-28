<script module>
    import { Braces, FileText } from "@lucide/svelte";
    import { HandleTypes } from "@model/Handle.svelte";
    import { HandleDefinition } from "@model/HandleDefinition.svelte";
    import { NodeDefs } from "@model/NodeCategory.svelte";
    import TextFile from "./FileInput/TextFile.svelte";
    import ObjectPreview from "./Preview/ObjectPreview.svelte";
    import JSONParser from "./ProcessString/JSONParser.svelte";

    /**
     * @typedef {Object} NodeProps
     * @prop {import('@model/Handle.svelte').HandleData[]} inputs
     * @prop {import('@model/Handle.svelte').HandleData[]} outputs
     * @prop {Object} [config]
     */

    export const registerNodes = () => {
        const { FileInput, Preview, ProcessString } = NodeDefs;

        FileInput.nodes = [];
        Preview.nodes = [];
        ProcessString.nodes = [];

        FileInput.createDefinition(
            "label.node.textinput",
            [],
            [
                new HandleDefinition(
                    "label.node.handle.textcontent",
                    HandleTypes.string,
                    "OUT",
                ),
            ],
            tfin,
            FileText,
        );
        Preview.createDefinition(
            "label.node.objectpreview",
            [
                new HandleDefinition(
                    "label.node.handle.inputobjects",
                    HandleTypes.object,
                    "IN",
                ),
            ],
            [],
            ojout,
            Braces,
        );
        ProcessString.createDefinition(
            "label.node.jsonparser",
            [
                new HandleDefinition(
                    "label.node.handle.inputtext",
                    HandleTypes.string,
                    "IN",
                ),
            ],
            [
                new HandleDefinition(
                    "label.node.handle.outputobjects",
                    HandleTypes.object,
                    "OUT",
                ),
            ],
            jsonparser,
            Braces,
        );
    };
</script>

{#snippet tfin({ inputs, outputs, config })}
    <TextFile {inputs} {outputs} {config}></TextFile>
{/snippet}
{#snippet ojout({ inputs, outputs, config })}
    <ObjectPreview {inputs} {outputs} {config}></ObjectPreview>
{/snippet}
{#snippet jsonparser({ inputs, outputs, config })}
    <JSONParser {inputs} {outputs} {config}></JSONParser>
{/snippet}
