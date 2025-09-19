<script module>
    /**
     * @typedef {"top"|"bottom"|"left"|"right"} Sides
     */
    /**
     * @param {Sides} side
     * @returns {Sides}
     */
    export const getOpposite = (side) => {
        switch (side) {
            case "top":
                return "bottom";
            case "bottom":
                return "top";
            case "left":
                return "right";
            case "right":
                return "left";
        }
    };
</script>
