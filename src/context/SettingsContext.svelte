<script module>
    export const PIPEVIEW = "pipeline";
    export const DATAVIEW = "data";
    /**
     * @type {PIPEVIEW|DATAVIEW}
     */
    let currentView = $state(PIPEVIEW);
    let isSidebarOpen = $state(true);
    let isSnapToGrid = $state(true);
    let gridSize = $state(20);

    /**
     * @param {PIPEVIEW|DATAVIEW} view
     */
    const changeView = (view) => (currentView = view);

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };

    const toggleSnapToGrid = () => {
        isSnapToGrid = !isSnapToGrid;
    };

    /**
     * @param {number} size
     */
    const changeGridSize = (size) => {
        gridSize = Math.min(200, Math.max(1, size));
    };

    export const getViewChanger = () => changeView;
    export const getSidebarToggler = () => toggleSidebar;
    export const getSnapToggler = () => toggleSnapToGrid;
    export const getGridChanger = () => changeGridSize;

    export const getCurrentView = () => () => currentView;
    export const getSidebarStatus = () => () => isSidebarOpen;
    export const getSnapToGrid = () => () => isSnapToGrid;
    export const getGridSize = () => () => gridSize;
</script>
