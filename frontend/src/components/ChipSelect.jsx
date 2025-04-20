import React from 'react'
import { Autocomplete, TextField } from '@mui/material'

function ChipSelect({ name, data, dataField, label, setState, state }) {
	const [loading, setLoading] = React.useState(false)

	const handleChange = (event, value) => {
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
				value={state}
				disableCloseOnSelect={true}
				onChange={handleChange}
				loading={loading}
				limitTags={2}
				noOptionsText={'Не найдено'}
				loadingText={'Загрузка...'}
				// getOptionLabel={(option) => option.title}
				renderInput={(params) => <TextField {...params} label={label} />}
			/>
		</>
	)
}

export default ChipSelect
