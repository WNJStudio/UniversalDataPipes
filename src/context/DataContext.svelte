<script module>
    /////////////////////////////
    ////   PIPILINE DATA     ////
    /////////////////////////////
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

    export const getDataContextSetter = () => dataSetter;

    export const getDataContextCleaner = () => dataCleaner;

    export const getDataContext = () => () => pipelineData;
</script>
