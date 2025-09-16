<script module>
    import { getContext, setContext } from "svelte";

    /////////////////////////////
    ////   PIPILINE DATA     ////
    /////////////////////////////
    const PIPELINE_DATA_SETTER = "pipeline_data_setter";
    const PIPELINE_DATA_CLEANER = "pipeline_data_cleaner";
    const PIPELINE_DATA = "pipeline_data";
    /**
     * @type {{[edgeId:string]:any}}
     */
    let pipelineData = $state({});
    /**
     * @param {string} edgeId
     * @param {any} data
     */
    const dataSetter = (edgeId, data) => {
        pipelineData[edgeId] = data;
    };
    /**
     * @param {string} edgeId
     */
    const dataCleaner = (edgeId) => {
        delete pipelineData[edgeId];
    };

    export const createDataContext = () => {
        setContext(PIPELINE_DATA_SETTER, dataSetter);
        setContext(PIPELINE_DATA_CLEANER, dataCleaner);
        setContext(PIPELINE_DATA, pipelineData);
    };

    /**
     * @returns {(edgeId:string, data:any)=>void}
     */
    export const getDataContextSetter = () => {
        return getContext(PIPELINE_DATA_SETTER);
    };

    /**
     * @returns {(edgeId:string)=>void}
     */
    export const getDataContextCleaner = () => {
        return getContext(PIPELINE_DATA_CLEANER);
    };

    /**
     * @returns {{[edgeId:string]:any}}
     */
    export const getDataContext = () => {
        return getContext(PIPELINE_DATA);
    };
</script>
