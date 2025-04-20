import React from 'react'
import { Autocomplete, TextField } from '@mui/material'

function ChipSelect({ name, data, dataField, label, setState, state }) {
	const handleChange = (event) => {
		const {
			target: { value },
		} = event
		setState((prev) => {
			return { ...prev, [name]: value }
		})
	}
	return (
		<>
			<Autocomplete
				multiple
				filterSelectedOptions
				id={`${name}-multiple-chip`}
				options={data}
				disableCloseOnSelect={true}
				onChange={handleChange}
				limitTags={2}
				// getOptionLabel={(option) => option.title}
				renderInput={(params) => <TextField {...params} label={label} />}
			/>
		</>
	)
}

export default ChipSelect
