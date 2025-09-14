<script module>
    /**
     * @abstract
     */
    export class Reactive {
        reactive() {
            return JSON.parse(JSON.stringify(this));
        }
    }
</script>
