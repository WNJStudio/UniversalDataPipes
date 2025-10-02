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
     * @prop {string} id
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
            TextFile,
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
            ObjectPreview,
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
            JSONParser,
            Braces,
        );
    };
</script>
