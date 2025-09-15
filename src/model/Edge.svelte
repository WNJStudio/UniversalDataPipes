<script module>
    import { v4 } from "uuid";
    import { Position } from "./Position.svelte";
    import { Reactive } from "./Reactive.svelte";

    export class EdgeData extends Reactive {
        /**
         * @param {string} id
         * @param {string} start start handleId
         * @param {string} startNode start nodeId
         * @param {string} endNode end NodeId
         * @param {string} end end handleId
         * @param {Position} tail
         */
        constructor(id, start, startNode, end, endNode, tail) {
            super();
            /**
             * @type {string} the id of the edge
             */
            this.id = id;
            /**
             * @type {string} the id of the starting handle
             */
            this.start = start;
            /**
             * @type {string} the id of the starting node
             */
            this.startNode = startNode;
            /**
             * @type {string} the id of the ending handle
             */
            this.end = end;
            /**
             * @type {string} the id of the ending node
             */
            this.endNode = endNode;
            /**
             * @type {Position} transient tail to track pending edge
             */
            this.tail = tail;
        }
        /**
         * @param {string} start
         * @param {string} startNode
         * @param {string} end
         * @param {string} endNode
         * @param {Position} tail
         */
        static create(start, startNode, end, endNode, tail) {
            return new EdgeData(v4(), start, startNode, end, endNode, tail);
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
    }
</script>
