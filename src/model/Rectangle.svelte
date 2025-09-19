<script module>
    /**
     * Reactive
     */
    export class Rectangle {
        /**
         * Reactive
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        constructor(x, y, width, height) {
            this.x = $state(x);
            this.y = $state(y);
            this.width = $state(width);
            this.height = $state(height);
        }
    }
</script>
