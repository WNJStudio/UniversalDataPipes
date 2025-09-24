<script module>
    /**
     * @typedef {Object} SizeObject
     * @prop {number} [width]
     * @prop {number} [height]
     */
    /**
     * Reactive
     */
    export class Size {
        /**
         * Reactive
         * @param {number} [width]
         * @param {number} [height]
         */
        constructor(width, height) {
            this.width = $state(width);
            this.height = $state(height);
        }

        /**
         * @param {any} obj
         */
        static create(obj) {
            if (!Size.validate(obj)) {
                throw new Error("Object signature not matching Size");
            }

            return new Size(obj.width, obj.height);
        }

        /**
         * @param {any} obj
         */
        static validate(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            if (
                (obj.width && isNaN(obj.width)) ||
                (obj.height && isNaN(obj.height))
            ) {
                return false;
            }
            return true;
        }

        /**
         * @returns {SizeObject}
         */
        toJSON() {
            return {
                width: this.width,
                height: this.height,
            };
        }
    }
</script>
