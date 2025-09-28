<script module>
    import { HandleData } from "./Handle.svelte";
    import { Position } from "./Position.svelte";
    import { Size } from "./Size.svelte";
    /**
     * @typedef {Object} NodeObject
     * @prop {string} id
     * @prop {string} category
     * @prop {string} name
     * @prop {import('./Position.svelte').PositionObject} position
     * @prop {import('./Size.svelte').SizeObject} [size]
     * @prop {import('./Size.svelte').SizeObject} [minSize]
     * @prop {import('./Handle.svelte').HandleObject[]} inputs
     * @prop {import('./Handle.svelte').HandleObject[]} outputs
     * @prop {Object} [config]
     */

    /**
     * @typedef {Object<string,NodeData>} NodeMap
     */
    /**
     * @typedef {Object<string,NodeObject>} NodeOMap
     */
    /**
     * Reactive
     */
    export class NodeData {
        /**
         * Reactive
         * @param {string} id
         * @param {string} category
         * @param {import('@i18n/i18n.svelte').i18nlabel} name
         * @param {Position} position
         * @param {Size} size
         * @param {Size} minSize
         * @param {HandleData[]} inputs
         * @param {HandleData[]} outputs
         * @param {Object} [config]
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
            config = {},
        ) {
            /**
             * @type {string}
             */
            this.id = $state(id);
            /**
             * @type {string}
             */
            this.category = $state(category);
            /**
             * @type {import('@i18n/i18n.svelte').i18nlabel}
             */
            this.name = $state(name);
            /**
             * @type {Position}
             */
            this.position = $state(position);
            /**
             * @type {Size}
             */
            this.size = $state(size);
            /**
             * @type {Size}
             */
            this.minSize = $state(minSize);
            /**
             * @type {HandleData[]}
             */
            this.inputs = $state(inputs);
            /**
             * @type {HandleData[]}
             */
            this.outputs = $state(outputs);
            /**
             * @type {Object}
             */
            this.config = $state(config);
        }

        /**
         * @param {any} obj
         */
        static create(obj) {
            if (!NodeData.validate(obj)) {
                throw new Error("Object signature not matching NodeData");
            }
            const position = Position.create(obj.position);
            const size = obj.size ? Size.create(obj.size) : new Size();
            const minSize = obj.minSize ? Size.create(obj.minSize) : new Size();
            const inputs = obj.inputs
                ? obj.inputs.map((i) => HandleData.create(i))
                : [];
            const outputs = obj.outputs
                ? obj.outputs.map((o) => HandleData.create(o))
                : [];

            return new NodeData(
                obj.id,
                obj.category,
                obj.name,
                position,
                size,
                minSize,
                inputs,
                outputs,
                obj.config,
            );
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
            if (obj.inputs) {
                if (!(obj.inputs instanceof Array)) {
                    return false;
                }
            }
            if (obj.outputs) {
                if (!(obj.outputs instanceof Array)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * @returns {NodeObject}
         */
        toJSON() {
            return {
                id: this.id,
                category: this.category,
                name: this.name,
                size: this.size?.toJSON(),
                minSize: this.minSize?.toJSON(),
                inputs: this.inputs.map((i) => i.toJSON()),
                outputs: this.outputs.map((o) => o.toJSON()),
                position: this.position.toJSON(),
                config: JSON.parse(JSON.stringify(this.config)),
            };
        }
    }
</script>
