<script module>
    import { Reactive } from "./Reactive.svelte";

    export class Size extends Reactive {
        /**
         *
         * @param {number} [width]
         * @param {number} [height]
         */
        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
        }
    }
</script>
