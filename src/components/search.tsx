import { Search } from "@mui/icons-material"
import { InputAdornment, TextField } from "@mui/material"
import { useState } from "react"


export const CustomSearch = (props: any) => {
    const [value, setValue] = useState('');
    const { label, callback, param } = props.data;

    const handleChange = (value: string) => {
        setValue(value);
        callback(value, param);
    }

    return (
        <>
            <TextField
                label={label}
                value={value}
                onChange={(e: any) => handleChange(e.target.value)}
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
