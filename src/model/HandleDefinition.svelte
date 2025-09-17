<script module>
    import { v4 } from "uuid";
    import { HandleData } from "./Handle.svelte";

    export class HandleDefinition {
        /**
         * @param {string} name
         * @param {import('./Handle.svelte').HandleType} type
         * @param {"IN"|"OUT"} dir
         */
        constructor(name, type, dir) {
            /**
             * @type {import('./Handle.svelte').HandleType}
             */
            this.type = type;
            /**
             * @type {"IN"|"OUT"}
             */
            this.dir = dir;
            /**
             * @type {string}
             */
            this.name = name;
        }

        /**
         * @param {string} nodeId
         */
        create(nodeId) {
            return new HandleData(v4(), nodeId, this.name, this.type, this.dir);
        }
    }
</script>
