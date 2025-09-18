<script module>
    export const PIPEVIEW = "pipeline";
    export const DATAVIEW = "data";

    const settings = JSON.parse(localStorage.getItem("UDP_SETTINGS") || "{}");
    /**
     * @type {PIPEVIEW|DATAVIEW}
     */
    let currentView = $state(settings.currentView || PIPEVIEW);
    let isSidebarOpen = $state(
        settings.isSidebarOpen !== undefined ? settings.isSidebarOpen : true,
    );
    let isSnapToGrid = $state(
        settings.isSnapToGrid !== undefined ? settings.isSnapToGrid : true,
    );
    let gridSize = $state(settings.gridSize || 20);

    let lastChange = $state(Date.now());
    let delayCheck = $state();

    const delayedSave = () => {
        lastChange = Date.now();
        if (delayCheck) {
            clearTimeout(delayCheck);
            delayCheck = undefined;
        }
        delayCheck = setTimeout(() => {
            if (Date.now() - lastChange > 500) {
                localStorage.setItem(
                    "UDP_SETTINGS",
                    JSON.stringify({
                        currentView,
                        isSidebarOpen,
                        isSnapToGrid,
                        gridSize,
                    }),
                );
            }
        }, 500);
    };

    /**
     * @param {PIPEVIEW|DATAVIEW} view
     */
    const changeView = (view) => {
        currentView = view;
        delayedSave();
    };

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
        delayedSave();
    };

    const toggleSnapToGrid = () => {
        isSnapToGrid = !isSnapToGrid;
        delayedSave();
    };

    /**
     * @param {number} size
     */
    const changeGridSize = (size) => {
        gridSize = Math.min(200, Math.max(1, size));
        delayedSave();
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
