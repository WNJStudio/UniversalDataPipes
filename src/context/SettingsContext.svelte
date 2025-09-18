<script module>
    import { getTimeDiff } from "../utils/TimeUtils";

    export const PIPEVIEW = "pipeline";
    export const DATAVIEW = "data";
    export const DOTS = "dots";
    export const CROSSES = "crosses";
    export const LINES = "lines";

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
    let lastSave = $state(settings.lastSave || undefined);

    /**
     * @type {DOTS|CROSSES|LINES}
     */
    let currentPattern = $state(DOTS);

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
                lastSave = Date.now();
                localStorage.setItem(
                    "UDP_SETTINGS",
                    JSON.stringify({
                        currentView,
                        isSidebarOpen,
                        isSnapToGrid,
                        gridSize,
                        lastSave,
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

    /**
     * @param {DOTS|CROSSES|LINES} pattern
     */
    const changePatterm = (pattern) => {
        currentPattern = pattern;
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
    export const getLastSavedSince = () => () => {
        if (!lastSave) {
            return "";
        }
        const timediff = getTimeDiff(lastSave, Date.now());
        if (timediff.trim() === "") {
            return "Just saved.";
        }

        return `Last saved ${timediff} ago.`;
    };

    /**
     * @param {number} scale
     */
    export const getPattern = (scale) => {
        return `background-image: radial-gradient(circle, hsl(var(--border)/0.5) 10%, transparent 10%); background-size: ${gridSize * scale}px ${gridSize * scale}px;`;
    };
</script>
