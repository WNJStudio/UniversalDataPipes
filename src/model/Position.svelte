<script module>
    import { Reactive } from "./Reactive.svelte";

    export class Position extends Reactive {
        /**
         * @param {number} x
         * @param {number} y
         */
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
        }
    }
</script>
