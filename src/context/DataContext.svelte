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

    /**
     * @returns {(edgeId:string, data:any)=>void}
     */
    export const getDataContextSetter = () => dataSetter;

    /**
     * @returns {(edgeId:string)=>void}
     */
    export const getDataContextCleaner = () => dataCleaner;

    /**
     * @returns {{[edgeId:string]:any}}
     */
    export const getDataContext = () => pipelineData;
</script>
