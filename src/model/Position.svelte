<script module>
    /**
     * @typedef {Object} PositionObject
     * @prop {number} x
     * @prop {number} y
     */
    /**
     * Reactive
     */
    export class Position {
        /**
         * Reactive
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            this.x = $state(x);
            this.y = $state(y);
        }

        /**
         * @param {any} obj
         */
        static create(obj) {
            if (!Position.validate(obj)) {
                throw new Error("Object signature not matching Position");
            }

            return new Position(obj.x, obj.y);
        }

        /**
         * @param {any} obj
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (isNaN(obj.x) || isNaN(obj.y)) {
                return false;
            }
            return true;
        }

        /**
         * @returns {PositionObject}
         */
        toJSON() {
            return {
                x: this.x,
                y: this.y,
            };
        }
    }
</script>
