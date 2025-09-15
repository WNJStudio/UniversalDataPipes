<script module>
    import { v4 } from "uuid";
    import { HandleData } from "./Handle.svelte";

    export class HandleDefinition {
        /**
         * @param {string} name
         * @param {string} type
         * @param {string} color
         * @param {"IN"|"OUT"} dir
         */
        constructor(name, type, dir, color) {
            this.type = type;
            this.dir = dir;
            this.color = color;
            this.name = name;
        }

        /**
         * @param {string} nodeId
         */
        create(nodeId) {
            return new HandleData(
                v4(),
                nodeId,
                this.name,
                this.type,
                this.dir,
                this.color,
            );
        }
    }
</script>
