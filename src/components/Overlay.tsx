import { Box } from "@mui/material"


export const Overlay = (props: any) => {
    const { hoverState = false, component = null } = props.data;

    return <Box
        sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: hoverState ? 1 : 0,
            borderRadius: "inherit"
        }}
    >
        {component}
    </Box>
}
