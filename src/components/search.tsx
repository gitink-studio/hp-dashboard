import { Search } from "@mui/icons-material"
import { InputAdornment, TextField } from "@mui/material"
import { useState } from "react"


export const CustomSearch = (props: any) => {
    const [value, setValue] = useState();
    const { label, onChange } = props.data;

    return (
        <>
            <TextField
                label={label}
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                size="small"
                sx={{ minWidth: 300 }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        )
                    }
                }}
            />
        </>
    )
}
