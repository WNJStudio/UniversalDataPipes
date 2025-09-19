<script module>
    import { v4 } from "uuid";
    import { Position } from "./Position.svelte";

    /**
     * @typedef {Object} EdgeObject
     * @prop {string} id
     * @prop {string} start start handleId
     * @prop {string} startNode start nodeId
     * @prop {string} endNode end NodeId
     * @prop {string} end end handleId
     */
    /**
     * @typedef {Object<string,EdgeData>} EdgeMap
     */
    /**
     * @typedef {Object<string,EdgeObject>} EdgeOMap
     */

    /**
     * Reactive
     */
    export class EdgeData {
        /**
         * Reactive
         * @param {string} id
         * @param {string} start start handleId
         * @param {string} startNode start nodeId
         * @param {string} endNode end NodeId
         * @param {string} end end handleId
         * @param {Position} tail
         */
        constructor(id, start, startNode, end, endNode, tail) {
            /**
             * @type {string} the id of the edge
             */
            this.id = $state(id);
            /**
             * @type {string} the id of the starting handle
             */
            this.start = $state(start);
            /**
             * @type {string} the id of the starting node
             */
            this.startNode = $state(startNode);
            /**
             * @type {string} the id of the ending handle
             */
            this.end = $state(end);
            /**
             * @type {string} the id of the ending node
             */
            this.endNode = $state(endNode);
            /**
             * @type {Position} transient tail to track pending edge
             */
            this.tail = $state(tail);
        }

        /**
         * @param {string} start
         * @param {string} startNode
         * @param {Position} tail
         */
        static createPending(start, startNode, tail) {
            return new EdgeData(v4(), start, startNode, null, null, tail);
        }
        /**
         * @param {any} obj
         */
        static create(obj) {
            if (!EdgeData.validate(obj)) {
                throw new Error("Object signature not matching EdgeData");
            }
            return new EdgeData(
                obj.id,
                obj.start,
                obj.startNode,
                obj.end,
                obj.endNode,
                null,
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
            if (
                !obj.id ||
                !obj.start ||
                !obj.startNode ||
                !obj.end ||
                !obj.endNode
            ) {
                return false;
            }
            return true;
        }

        /**
         * @returns {EdgeObject}
         */
        toJSON() {
            return {
                id: this.id,
                start: this.start,
                startNode: this.startNode,
                end: this.end,
                endNode: this.endNode,
            };
        }
    }
</script>
