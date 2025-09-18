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
    let currentPattern = $state(settings.currentPattern || DOTS);

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
                        currentPattern,
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
    export const getPatternChanger = () => changePatterm;

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
    export const getCurrentPattern = () => () => currentPattern;

    /**
     * @param {number} scale
     */
    export const getPattern = (scale) => {
        const size = gridSize * scale;
        const size10 = size * 10;
        const color = "hsl(var(--border) / 0.5)";
        const colorLight = "hsl(var(--border) / 0.75)";
        const background = "var(--color-background)";
        const dotSize = 10;
        const lineWidth = 5;
        const line10Width = 0.5;
        const gap = 15;

        switch (currentPattern) {
            case "lines":
                const vDashes = [];
                let coeff = lineWidth * 3;
                for (let v = 0, l = coeff * v; l < 100; v++, l = coeff * v) {
                    vDashes.push(
                        `${v % 2 === 0 ? background : `transparent`} ${l}%, ${v % 2 === 0 ? `transparent` : background} ${l}%`,
                    );
                }
                return `background-image: linear-gradient(${colorLight} ${line10Width}%, transparent ${line10Width}%),
                                          linear-gradient(90deg, ${colorLight} ${line10Width}%, transparent ${line10Width}%),
                                          linear-gradient(${vDashes.join(",")}),
                                          linear-gradient(90deg, ${vDashes.join(",")}),
                                          linear-gradient(${color} ${lineWidth}%, transparent ${lineWidth}%), 
                                          linear-gradient(90deg, ${color} ${lineWidth}%, transparent ${lineWidth}%);
                        background-size: ${size10}px ${size10}px, ${size10}px ${size10}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px;`;
            case "crosses":
                return `background-image: linear-gradient(${colorLight} ${line10Width}%, transparent ${line10Width}%),
                                          linear-gradient(90deg, ${colorLight} ${line10Width}%, transparent ${line10Width}%),
                                          linear-gradient(transparent ${gap}%, ${background} ${gap}%,${background} ${100 - gap}%, transparent ${100 - gap}%),
                                          linear-gradient(90deg, transparent ${gap}%, ${background} ${gap}%,${background} ${100 - gap}%, transparent ${100 - gap}%),
                                          linear-gradient(${color} ${lineWidth}%, transparent ${lineWidth}%), 
                                          linear-gradient(90deg, ${color} ${lineWidth}%, transparent ${lineWidth}%);
                        background-size: ${size10}px ${size10}px, ${size10}px ${size10}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px;`;
            case "dots":
            default:
                return `background-image: radial-gradient(circle, ${color} ${dotSize}%, transparent ${dotSize}%),
                                          linear-gradient(${colorLight} ${line10Width}%, transparent ${line10Width}%),
                                          linear-gradient(90deg, ${colorLight} ${line10Width}%, transparent ${line10Width}%);
                        background-size: ${size}px ${size}px, ${size10}px ${size10}px, ${size10}px ${size10}px;`;
        }
    };
    /**
     * @param {import("../model/Pipeline.svelte").Transform} t transform
     */
    export const getPatternOffset = (t) => {
        let offsetRadial = (gridSize * t.scale) / 2;
        let offsetLinear = gridSize * t.scale * 0.025;
        const posX = t.x * t.scale;
        const posY = t.y * t.scale;

        let vertical = `${posX}px ${posY - offsetLinear}px`;
        let horizontal = `${posX - offsetLinear}px ${posY}px`;
        switch (currentPattern) {
            case "lines":
                return `background-position: ${vertical}, ${horizontal}, ${vertical}, ${horizontal}, ${vertical}, ${horizontal}`;
            case "crosses":
                const mask = `${posX}px ${posY}px`;
                return `background-position: ${vertical}, ${horizontal}, ${mask}, ${mask}, ${vertical}, ${horizontal}`;
            case "dots":
            default:
                return `background-position: ${posX + offsetRadial}px ${posY + offsetRadial}px,
                                             ${vertical},
                                             ${horizontal}`;
        }
    };
</script>
