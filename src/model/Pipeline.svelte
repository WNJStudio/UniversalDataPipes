<script module>
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

    export class Pipeline {
        static cache = {};
        /**
         * @type {Pipeline[]}
         */
        static cacheArray = [];

        /**
         * @returns
         */
        static load() {
            const ps = localStorage.getItem("UDP_PIPELINES") || "{}";
            try {
                const pj = JSON.parse(ps);
                Pipeline.cache = pj;
                return Pipeline.refreshCache();
            } catch (e) {
                console.error("Parse error: clean up the cache", e);
            }
            return Pipeline.cacheArray;
        }

        /**
         * @param {Pipeline} pipe
         * @returns
         */
        static save(pipe) {
            Pipeline.cache[pipe.name] = {
                name: pipe.name,
                nodes: pipe.nodes,
                edges: pipe.edges,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem(
                "UDP_PIPELINES",
                JSON.stringify(Pipeline.cache),
            );
            return Pipeline.load();
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
                            Pipeline.cache[pipe.name] = {
                                name: pipe.name,
                                nodes: pipe.nodes,
                                edges: pipe.edges,
                                savedAt: new Date().toISOString(),
                            };
                            success += 1;
                        } else {
                            failure += 1;
                        }
                    });
                } else {
                    if (Pipeline.validate(pipes)) {
                        Pipeline.cache[pipes.name] = {
                            name: pipes.name,
                            nodes: pipes.nodes,
                            edges: pipes.edges,
                            savedAt: new Date().toISOString(),
                        };
                        success += 1;
                    } else {
                        failure += 1;
                    }
                }
                if (success > 0) {
                    localStorage.setItem(
                        "UDP_PIPELINES",
                        JSON.stringify(Pipeline.cache),
                    );
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
         * @param {string} name
         * @returns
         */
        static delete(name) {
            delete Pipeline.cache[name];
            localStorage.setItem(
                "UDP_PIPELINES",
                JSON.stringify(Pipeline.cache),
            );
            return Pipeline.load();
        }

        /**
         * @param {string} name
         * @returns
         */
        static hasPipe(name) {
            if (!name || name === "") {
                return false;
            }
            return Pipeline.cache[name] ? true : false;
        }

        /**
         * @returns
         */
        static refreshCache() {
            const temp = Object.entries(Pipeline.cache).map((entry) => {
                return new Pipeline(
                    entry[1].nodes,
                    entry[1].edges,
                    entry[0],
                    entry[1].savedAt,
                );
            });
            temp.sort((a, b) => b.saveTime - a.saveTime);
            Pipeline.cacheArray = temp;
            return Pipeline.cacheArray;
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
