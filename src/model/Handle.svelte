<script module>
    import { v4 } from "uuid";
    import { EdgeData } from "./Edge.svelte";
    import { Reactive } from "./Reactive.svelte";

    export class HandleData extends Reactive {
        /**
         *
         * @param {string} id
         * @param {string} name
         * @param {string} nodeId
         * @param {string} type
         * @param {string} color
         * @param {"IN"|"OUT"} dir
         */
        constructor(id, nodeId, name, type, dir, color) {
            super();
            this.id = id;
            this.nodeId = nodeId;
            this.name = name;
            this.type = type;
            this.dir = dir;
            this.color = color;
        }

        /**
         * @param {any} obj
         * @returns {boolean}
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (
                !obj.id ||
                !obj.nodeId ||
                !obj.name ||
                !obj.type ||
                !obj.dir ||
                !obj.color
            ) {
                return false;
            }
            return true;
        }
    }
</script>
