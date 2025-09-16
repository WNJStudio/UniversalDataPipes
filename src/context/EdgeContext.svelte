<script module>
    import { EdgeData } from "../model/Edge.svelte";

    /**
     * @type {{[id:string]:EdgeData}}
     */
    let edges = $state({});

    /**
     * @param {{[id: string]:EdgeData}} newData
     */
    const changeEdges = (newData) => (edges = newData);

    /**
     * @param {string} id
     */
    const removeEdge = (id) => {
        delete edges[id];
    };

    /**
     * @param {string} id
     * @param {EdgeData} edge
     */
    const addEdge = (id, edge) => {
        edges[id] = edge;
    };

    export const getEdgeDataSetter = () => changeEdges;

    export const getEdgeDataRemover = () => removeEdge;
    export const getEdgeDataAdder = () => addEdge;

    /**
     * @returns {{[id:string]:EdgeData}}
     */
    export const getEdgeData = () => edges;
</script>
