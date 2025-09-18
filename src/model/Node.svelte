<script module>
    import { HandleData } from "./Handle.svelte";
    import { Position } from "./Position.svelte";
    import { Reactive } from "./Reactive.svelte";
    import { Size } from "./Size.svelte";

    export class NodeData extends Reactive {
        /**
         * @param {string} id
         * @param {string} category
         * @param {string} name
         * @param {Position} position
         * @param {Size} size
         * @param {Size} minSize
         * @param {HandleData[]} inputs
         * @param {HandleData[]} outputs
         */
        constructor(
            id,
            category,
            name,
            position = new Position(0, 0),
            size = undefined,
            minSize = undefined,
            inputs = [],
            outputs = [],
        ) {
            super();
            /**
             * @type {string}
             */
            this.id = id;
            /**
             * @type {string}
             */
            this.category = category;
            /**
             * @type {string}
             */
            this.name = name;
            /**
             * @type {Position}
             */
            this.position = position;
            /**
             * @type {Size}
             */
            this.size = size;
            /**
             * @type {Size}
             */
            this.minSize = minSize;
            /**
             * @type {HandleData[]}
             */
            this.inputs = inputs;
            /**
             * @type {HandleData[]}
             */
            this.outputs = outputs;
        }

        /**
         * @param {any} obj
         * @returns {boolean}
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (!obj.id || !obj.category || !obj.name || !obj.position) {
                return false;
            }
            if (typeof obj.position !== "object") {
                return false;
            }
            if (isNaN(obj.position.x) || isNaN(obj.position.y)) {
                return false;
            }
            if (obj.inputs) {
                if (!(obj.inputs instanceof Array)) {
                    return false;
                }
                if (obj.inputs.some((e) => !HandleData.validate(e))) {
                    return false;
                }
            }
            if (obj.outputs) {
                if (!(obj.outputs instanceof Array)) {
                    return false;
                }
                if (obj.outputs.some((n) => !HandleData.validate(n))) {
                    return false;
                }
            }
            return true;
        }
    }
</script>
