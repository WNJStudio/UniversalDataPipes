<script module>
    /**
     * Reactive
     */
    export class Transform {
        /**
         * Reactive
         * @param {number} x
         * @param {number} y
         * @param {number} scale
         */
        constructor(x, y, scale) {
            /**
             * @type {number}
             */
            this.x = $state(x);
            /**
             * @type {number}
             */
            this.y = $state(y);
            /**
             * @type {number}
             */
            this.scale = $state(scale);
        }

        /**
         * Converts the given canvas coordinates into screen coordinates
         * @param {number} x
         * @param {number} y
         */
        screenPosition(x, y) {
            return { x: x * this.scale, y: y * this.scale };
        }
        /**
         * Converts the given screen coordinates into canvas coordinates
         * @param {number} x
         * @param {number} y
         * @param {boolean} [ref]
         */
        canvasPosition(x, y, ref = false) {
            if (ref) {
                return { x: x / this.scale, y: y / this.scale };
            }
            return { x: x / this.scale - this.x, y: y / this.scale - this.y };
        }
    }
</script>
