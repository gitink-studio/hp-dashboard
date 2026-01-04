import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material"
import { customStyle } from "../common/styles";

export const CustomDropdown = (props: any) => {
    const { label, value, options = [], handleChange } = props.data;
    const allOption = { id: 'All', name: 'All' }
    const newOptions = [allOption, ...options]

    return (
        <FormControl key={label}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={handleChange}
                size={customStyle.dropdown.size as SelectProps['size']}
                sx={{ width: customStyle.dropdown.width }}
            >
                {
                    newOptions.map((option: any) => (
                        <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}
