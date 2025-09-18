<script module>
    import { PersistedState } from "runed";
    import { EdgeData } from "./Edge.svelte";
    import { NodeData } from "./Node.svelte";
    export class Transform {
        /**
         * @param {number} x
         * @param {number} y
         * @param {number} scale
         */
        constructor(x, y, scale) {
            this.x = x;
            this.y = y;
            this.scale = scale;
        }
        reactive() {
            return JSON.parse(JSON.stringify(this));
        }
    }
    export class Movement {
        /**
         * @param {number} x
         * @param {number} y
         * @param {number} tx
         * @param {number} ty
         */
        constructor(x, y, tx, ty) {
            this.x = x;
            this.y = y;
            this.tx = tx;
            this.ty = ty;
        }
        reactive() {
            return JSON.parse(JSON.stringify(this));
        }
    }

    /**
     * @type {PersistedState<{[id:string]:Pipeline}>}
     */
    export const pipelineStorage = new PersistedState("UDP_PIPELINES", {});

    export class Pipeline {
        /**
         * @returns {Pipeline[]}
         */
        static load() {
            const temp = Object.values(pipelineStorage.current);
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
                if (pipes instanceof Array) {
                    pipes.forEach((pipe) => {
                        if (Pipeline.validate(pipe)) {
                            const pipeO = new Pipeline(
                                pipe.nodes,
                                pipe.edges,
                                pipe.name,
                                new Date().toISOString(),
                            );
                            pipelineStorage.current[pipe.name] = pipeO;
                            success += 1;
                        } else {
                            failure += 1;
                        }
                    });
                } else {
                    if (Pipeline.validate(pipes)) {
                        const pipeO = new Pipeline(
                            pipes.nodes,
                            pipes.edges,
                            pipes.name,
                            new Date().toISOString(),
                        );
                        pipelineStorage.current[pipes.name] = pipeO;
                        success += 1;
                    } else {
                        failure += 1;
                    }
                }
            }
            return { success, failure };
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
                if (
                    Object.values(obj.edges).some((e) => !EdgeData.validate(e))
                ) {
                    return false;
                }
            }
            if (obj.nodes) {
                if (typeof obj.nodes !== "object") {
                    return false;
                }
                if (
                    Object.values(obj.nodes).some((n) => !NodeData.validate(n))
                ) {
                    return false;
                }
            }
            return true;
        }

        /**
         * @param {{[id:string]:NodeData}} nodes
         * @param {{[id:string]:EdgeData}} edges
         * @param {string} name
         * @param {string} savedAt
         */
        constructor(nodes = {}, edges = {}, name = "", savedAt = "") {
            this.nodes = nodes;
            this.edges = edges;
            this.name = name;
            this.savedAt = savedAt;
            this._savedAt = new Date(savedAt);
        }

        /**
         * @return  {{[id:string]:NodeData}}
         */
        get reactiveNodes() {
            return JSON.parse(JSON.stringify(this.nodes));
        }
        /**
         * @return  {{[id:string]:EdgeData}}
         */
        get reactiveEdges() {
            return JSON.parse(JSON.stringify(this.edges));
        }

        setSavedAt(sa) {
            this.savedAt = sa;
            this._savedAt = new Date(sa);
        }

        get saveLocalString() {
            return this._savedAt.toLocaleDateString();
        }

        get saveTime() {
            return this._savedAt.getTime();
        }
    }
</script>
