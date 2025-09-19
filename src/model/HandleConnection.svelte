<script module>
    import { EdgeData } from "./Edge.svelte";
    import { HandleData } from "./Handle.svelte";
    /**
     * Reactive
     */
    export class HandleConnection {
        /**
         * Reactive
         * @param {HandleData} start
         */
        constructor(start) {
            /**
             * @type {HandleData}
             */
            this.start = $state(start);
            /**
             * @type {HandleData}
             */
            this.end = $state();
        }

        /**
         * @param {HandleData} end
         * @param {EdgeData[]} edges
         */
        connect(end, edges) {
            if (
                edges.some(
                    (edge) =>
                        edge.start === this.start.id && edge.end === end.id,
                )
            ) {
                return false;
            }
            if (
                edges.some(
                    (edge) =>
                        edge.end === this.start.id && edge.start === end.id,
                )
            ) {
                return false;
            }
            if (this.start.id === end.id) {
                return false;
            }
            if (
                this.start.type.type !== "any" &&
                end.type.type !== "any" &&
                this.start.type.type !== end.type.type
            ) {
                return false;
            }
            if (this.start.dir === end.dir) {
                return false;
            }
            if (this.start.nodeId === end.nodeId) {
                return false;
            }
            this.end = end;
            return true;
        }
    }
</script>
