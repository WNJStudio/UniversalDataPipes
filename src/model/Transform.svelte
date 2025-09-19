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
    }
</script>
