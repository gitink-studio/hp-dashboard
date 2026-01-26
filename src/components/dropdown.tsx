import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material"
import { customStyle } from "../common/styles";

export const CustomDropdown = (props: any) => {
    const allOption = { id: 'All', name: 'All' };
    const { label, value, options = [], isDateRange = false, handleChange } = props.data;
    const newOptions = isDateRange ? options : [allOption, ...options];

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
                        <MenuItem key={option.value ? option.name : option.id} value={option.value ? option.value : option.name}>{option.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}
