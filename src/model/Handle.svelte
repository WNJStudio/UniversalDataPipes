<script module>
    /**
     * @typedef {{type:string,color:string}} HandleType
     */
    /**
     * @typedef {Object} HandleObject
     * @prop {string} id
     * @prop {string} name
     * @prop {string} nodeId
     * @prop {HandleType} type
     * @prop {"IN"|"OUT"} dir
     */

    export const HandleTypes = {
        object: {
            type: "object",
            color: "bg-yellow-500",
        },
        number: {
            type: "number",
            color: "bg-green-500",
        },
        string: {
            type: "string",
            color: "bg-blue-500",
        },
        boolean: {
            type: "boolean",
            color: "bg-purple-500",
        },
        any: {
            type: "any",
            color: "bg-gray-400",
        },
    };
    /**
     * Reactive
     */
    export class HandleData {
        /**
         * Reactive
         * @param {string} id
         * @param {string} name
         * @param {string} nodeId
         * @param {HandleType} type
         * @param {"IN"|"OUT"} dir
         */
        constructor(id, nodeId, name, type, dir) {
            /**
             * @type {string}
             */
            this.id = $state(id);
            /**
             * @type {string}
             */
            this.nodeId = $state(nodeId);
            /**
             * @type {string}
             */
            this.name = $state(name);
            /**
             * @type {HandleType}
             */
            this.type = $state(type);
            /**
             * @type {"IN"|"OUT"}
             */
            this.dir = $state(dir);
        }

        /**
         * @param {any} obj
         */
        static create(obj) {
            if (!HandleData.validate(obj)) {
                throw new Error("Object signature not matching HandleData");
            }
            return new HandleData(
                obj.id,
                obj.nodeId,
                obj.name,
                obj.type,
                obj.dir,
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
            if (!obj.id || !obj.nodeId || !obj.name || !obj.type || !obj.dir) {
                return false;
            }
            if (obj.dir !== "IN" && obj.dir !== "OUT") {
                return false;
            }
            if (!obj.type.type || !obj.type.color) {
                return false;
            }
            return true;
        }

        /**
         * @returns {HandleObject}
         */
        toJSON() {
            return {
                id: this.id,
                dir: this.dir,
                name: this.name,
                nodeId: this.nodeId,
                type: { ...this.type },
            };
        }
    }
</script>
