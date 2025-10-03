<script module>
    import {
        Braces,
        Download,
        FileText,
        Globe,
        RectangleEllipsis,
        TextCursorInput,
    } from "@lucide/svelte";
    import { HandleTypes } from "@model/Handle.svelte";
    import { HandleDefinition } from "@model/HandleDefinition.svelte";
    import { NodeDefs } from "@model/NodeCategory.svelte";
    import TextFile from "./FileInput/TextFile.svelte";
    import ObjectPreview from "./Preview/ObjectPreview.svelte";
    import JSONParser from "./ProcessString/JSONParser.svelte";
    import TextExport from "./Export/Text.svelte";
    import StringConstant from "./Constant/String.svelte";
    import SSE from "./HTTP/SSE.svelte";
    import SetField from "./ProcessObject/SetField.svelte";

    /**
     * @typedef {Object} NodeProps
     * @prop {string} id
     */

    export const registerNodes = () => {
        const {
            FileInput,
            Preview,
            ProcessString,
            Export,
            Constant,
            HTTP,
            ProcessObject,
        } = NodeDefs;

        FileInput.nodes = [];
        Preview.nodes = [];
        ProcessString.nodes = [];
        Export.nodes = [];
        Constant.nodes = [];
        HTTP.nodes = [];
        ProcessObject.nodes = [];

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
        Export.createDefinition(
            "label.node.textexport",
            [new HandleDefinition("label.data", HandleTypes.any, "IN")],
            [],
            TextExport,
            Download,
        );
        Constant.createDefinition(
            "label.node.stringconst",
            [],
            [
                new HandleDefinition(
                    "label.node.handle.outputstring",
                    HandleTypes.string,
                    "OUT",
                ),
            ],
            StringConstant,
            TextCursorInput,
        );
        HTTP.createDefinition(
            "label.node.sse",
            [
                new HandleDefinition("label.headers", HandleTypes.object, "IN"),
                new HandleDefinition("label.body", HandleTypes.object, "IN"),
            ],
            [new HandleDefinition("label.data", HandleTypes.object, "OUT")],
            SSE,
            Globe,
        );
        ProcessObject.createDefinition(
            "label.node.setfield",
            [
                new HandleDefinition(
                    "label.node.handle.inputobjects",
                    HandleTypes.object,
                    "IN",
                ),
                new HandleDefinition(
                    "label.node.handle.field.data",
                    HandleTypes.any,
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
            SetField,
            RectangleEllipsis,
        );
    };
</script>
