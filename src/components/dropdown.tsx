import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material"
import { customStyle } from "../common/styles";


export const CustomDropdown = (props: any) => {
    const { label, value, options, handleChange } = props.data;

    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={handleChange}
                size={customStyle.dropdown.size as SelectProps['size']}
                sx={{ width: customStyle.dropdown.width }}
            >
                {
                    options.map((option: any, index: number) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}
