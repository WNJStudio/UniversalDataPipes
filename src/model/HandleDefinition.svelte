<script module>
    import { v4 } from "uuid";
    import { HandleData } from "./Handle.svelte";
    /**
     * Reactive
     */
    export class HandleDefinition {
        /**
         * Reactive
         * @param {import('@i18n/i18n.svelte').i18nlabel} name
         * @param {import('./Handle.svelte').HandleType} type
         * @param {"IN"|"OUT"} dir
         */
        constructor(name, type, dir) {
            /**
             * @type {import('./Handle.svelte').HandleType}
             */
            this.type = $state(type);
            /**
             * @type {"IN"|"OUT"}
             */
            this.dir = $state(dir);
            /**
             * @type {import('@i18n/i18n.svelte').i18nlabel}
             */
            this.name = $state(name);
        }

        /**
         * @param {string} nodeId
         */
        create(nodeId) {
            return new HandleData(v4(), nodeId, this.name, this.type, this.dir);
        }
    }
</script>
