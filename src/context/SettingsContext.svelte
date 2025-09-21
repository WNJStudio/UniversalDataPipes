<script module>
    import { PersistedState } from "runed";
    import { getTimeDiff } from "../utils/TimeUtils";
    import { t } from "../i18n/i18n.svelte";

    export const PIPEVIEW = "pipeline";
    export const DATAVIEW = "data";
    export const DOTS = "dots";
    export const CROSSES = "crosses";
    export const LINES = "lines";

    /**
     * @typedef {Object} Settings
     * @prop {PIPEVIEW|DATAVIEW} currentView
     * @prop {boolean} isSidebarOpen
     * @prop {boolean} isSnapToGrid
     * @prop {number} gridSize
     * @prop {DOTS|CROSSES|LINES} currentPattern
     * @prop {number} [lastSave]
     * @prop {string} lang
     *
     */

    /**
     * @type {PersistedState<Settings>}
     */
    const settings = new PersistedState("UDP_SETTINGS", {
        currentView: PIPEVIEW,
        currentPattern: DOTS,
        gridSize: 20,
        isSidebarOpen: true,
        isSnapToGrid: true,
        lang: "system",
    });

    /**
     * @param {PIPEVIEW|DATAVIEW} view
     */
    const changeView = (view) => {
        settings.current.currentView = view;
        settings.current.lastSave = Date.now();
    };

    const toggleSidebar = () => {
        settings.current.isSidebarOpen = !settings.current.isSidebarOpen;
        settings.current.lastSave = Date.now();
    };

    const toggleSnapToGrid = () => {
        settings.current.isSnapToGrid = !settings.current.isSnapToGrid;
        settings.current.lastSave = Date.now();
    };

    /**
     * @param {number} size
     */
    const changeGridSize = (size) => {
        settings.current.gridSize = Math.min(200, Math.max(1, size));
        settings.current.lastSave = Date.now();
    };

    /**
     * @param {DOTS|CROSSES|LINES} pattern
     */
    const changePattern = (pattern) => {
        settings.current.currentPattern = pattern;
        settings.current.lastSave = Date.now();
    };

    /**
     * @param {string} lang
     */
    const changeLanguage = (lang) => {
        settings.current.lang = lang;
        document.documentElement.setAttribute(
            "lang",
            lang === "system" ? "en-US" : lang,
        );
        settings.current.lastSave = Date.now();
    };

    export const getViewChanger = () => changeView;
    export const getSidebarToggler = () => toggleSidebar;
    export const getSnapToggler = () => toggleSnapToGrid;
    export const getGridChanger = () => changeGridSize;
    export const getPatternChanger = () => changePattern;
    export const getLanguageChanger = () => changeLanguage;

    export const getCurrentView = () => () => settings.current.currentView;
    export const getSidebarStatus = () => () => settings.current.isSidebarOpen;
    export const getSnapToGrid = () => () => settings.current.isSnapToGrid;
    export const getGridSize = () => () => settings.current.gridSize;
    export const getLastSavedSince = () => () => {
        if (!settings.current.lastSave) {
            return "";
        }
        const timediff = getTimeDiff(settings.current.lastSave, Date.now());
        if (timediff.trim() === "") {
            return t("label.justsaved");
        }

        return t("template.lastsaved", timediff);
    };
    export const getCurrentPattern = () => () =>
        settings.current.currentPattern;
    export const getLanguage = () => () => settings.current.lang;
    /**
     * @param {number} scale
     */
    export const getPattern = (scale) => {
        const size = settings.current.gridSize * scale;
        const size10 = size * 10;
        const color = "hsl(var(--border) / 0.5)";
        const colorLight = "hsl(var(--border) / 0.75)";
        const background = "var(--color-background)";
        const dotSize = 10;
        const lineWidth = 5;
        const line10Width = 0.5;
        const gap = 15;

        switch (settings.current.currentPattern) {
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
     * @param {import("../model/Transform.svelte").Transform} t transform
     */
    export const getPatternOffset = (t) => {
        let offsetRadial = (settings.current.gridSize * t.scale) / 2;
        let offsetLinear = settings.current.gridSize * t.scale * 0.025;
        const posX = t.x * t.scale;
        const posY = t.y * t.scale;

        let vertical = `${posX}px ${posY - offsetLinear}px`;
        let horizontal = `${posX - offsetLinear}px ${posY}px`;
        switch (settings.current.currentPattern) {
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
