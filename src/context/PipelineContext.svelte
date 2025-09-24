<script module>
    import { Context } from "runed";

    /**
     * @type {Context<import('@model/Pipeline.svelte').Pipeline>}
     */
    export const pipelineContext = new Context("currentPipeline");
</script>
