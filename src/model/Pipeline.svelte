<script module>
    import { PersistedState } from "runed";
    import { EdgeData } from "./Edge.svelte";
    import { NodeData } from "./Node.svelte";
    /**
     * @typedef {Object} PipelineObject
     * @prop {string} name
     * @prop {import('./Edge.svelte').EdgeOMap} edges
     * @prop {import('./Node.svelte').NodeOMap} nodes
     * @prop {string} savedAt
     */

    /**
     * @typedef {Object<string,PipelineObject>} PipelineOMap
     */

    /**
     * @type {PersistedState<PipelineOMap>}
     */
    export const pipelineStorage = new PersistedState("UDP_PIPELINES", {});
    /**
     * Reactive
     */
    export class Pipeline {
        /**
         * @returns {Pipeline[]} sorted
         */
        static load() {
            const temp = Object.values(pipelineStorage.current).map((o) =>
                Pipeline.create(o, false),
            );
            temp.sort((a, b) => b.saveTime - a.saveTime);
            return temp;
        }

        /**
         * @param {any} pipes
         * @returns {{success:number,failure:number}}
         */
        static import(pipes) {
            let success = 0;
            let failure = 0;
            if (typeof pipes === "object") {
                if (!(pipes instanceof Array)) {
                    pipes = [pipes];
                }
                pipes.forEach((pipe) => {
                    try {
                        pipelineStorage.current[pipe.name] =
                            Pipeline.create(pipe);
                        success += 1;
                    } catch (e) {
                        console.log("Import failed: ", e);
                        failure += 1;
                    }
                });
            }
            return { success, failure };
        }

        /**
         * @param {any} pipe
         * @param {boolean} [isNew]
         */
        static create(pipe, isNew = true) {
            if (!Pipeline.validate(pipe)) {
                throw new Error("Object signature not matching Pipeline");
            }
            /**
             * @type {Object<string,NodeData>}
             */
            const nodes = {};
            Object.entries(pipe.nodes).forEach(([id, node]) => {
                nodes[id] = NodeData.create(node);
            });
            /**
             * @type {Object<string,EdgeData>}
             */
            const edges = {};
            Object.entries(pipe.edges).forEach(([id, edge]) => {
                edges[id] = EdgeData.create(edge);
            });

            return new Pipeline(
                nodes,
                edges,
                pipe.name,
                isNew ? new Date().toISOString() : pipe.savedAt,
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
            if (!obj.name) {
                return false;
            }
            if (obj.edges) {
                if (typeof obj.edges !== "object") {
                    return false;
                }
            }
            if (obj.nodes) {
                if (typeof obj.nodes !== "object") {
                    return false;
                }
            }
            return true;
        }

        /**
         * Reactive
         * @param {import('./Node.svelte').NodeMap} nodes
         * @param {import('./Edge.svelte').EdgeMap} edges
         * @param {string} name
         * @param {string} savedAt
         */
        constructor(nodes = {}, edges = {}, name = "", savedAt = "") {
            /**
             * @type {import('./Node.svelte').NodeMap}
             */
            this.nodes = $state(nodes);
            /**
             * @type {import('./Edge.svelte').EdgeMap}
             */
            this.edges = $state(edges);
            /**
             * @type {string}
             */
            this.name = $state(name);

            this.setSavedAt(savedAt);
        }

        /**
         * @param {Pipeline} pipe
         */
        shipOfTheseus(pipe) {
            const temp = Pipeline.create(pipe.toJSON());
            this.name = temp.name;
            this.edges = temp.edges;
            this.nodes = temp.nodes;
            this.setSavedAt(temp.savedAt);
        }

        /**
         * @param {string} sa
         */
        setSavedAt(sa) {
            /**
             * @type {string}
             */
            this.savedAt = sa;
            /**
             * @type {Date}
             */
            this._savedAt = new Date(sa);
        }

        /**
         * @param {string} id
         */
        findHandle(id) {
            return Object.values(this.nodes)
                .flatMap((n) => [...n.inputs, ...n.outputs])
                .find((v) => v.id === id);
        }

        get saveLocalString() {
            return this._savedAt.toLocaleDateString();
        }

        get saveTime() {
            return this._savedAt.getTime();
        }

        /**
         * @returns {PipelineObject}
         */
        toJSON() {
            /**
             * @type {import('./Node.svelte').NodeOMap}
             */
            const nodes = {};
            Object.entries(this.nodes).forEach(([id, node]) => {
                nodes[id] = node.toJSON();
            });
            /**
             * @type {import('./Edge.svelte').EdgeOMap}
             */
            const edges = {};
            Object.entries(this.edges).forEach(([id, edge]) => {
                edges[id] = edge.toJSON();
            });
            return {
                name: this.name,
                edges,
                nodes,
                savedAt: this.savedAt,
            };
        }
    }
</script>
