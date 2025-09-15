<script module>
    import { HandleData } from "./Handle.svelte";
    import { Position } from "./Position.svelte";
    import { Reactive } from "./Reactive.svelte";

    export class NodeData extends Reactive {
        /**
         * @param {string} id
         * @param {string} category
         * @param {string} name
         * @param {Position}position
         * @param {HandleData[]} inputs
         * @param {HandleData[]} outputs
         */
        constructor(
            id,
            category,
            name,
            position = new Position(0, 0),
            inputs = [],
            outputs = [],
        ) {
            super();
            this.id = id;
            this.category = category;
            this.name = name;
            this.position = position;
            this.inputs = inputs;
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
