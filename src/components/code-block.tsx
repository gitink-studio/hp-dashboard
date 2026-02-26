import { Box } from "@mui/material";

export const CodeBlock = (code: any) => {
    return (
        <Box
            component="pre"
            sx={{
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                fontFamily: "monospace",
                fontSize: 14,
                borderRadius: 1,
                p: 2,
                overflowX: "auto",
            }}
        >
            {code}
        </Box>
    );
}