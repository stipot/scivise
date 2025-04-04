import React, { useState } from 'react'
import {
	Select,
	OutlinedInput,
	Chip,
	MenuItem,
	InputLabel,
	Box,
} from '@mui/material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}

function ChipSelect({ name, data, dataField, label }) {
	const [value, setValue] = useState([])
	const handleChange = (event) => {
		const {
			target: { value },
		} = event
		setValue(value)
	}
	return (
		<>
			<InputLabel id={`${name}-multiple-chip-label`}>{label}</InputLabel>
			<Select
				labelId={`${name}-multiple-chip-label`}
				id={`${name}-multiple-chip`}
				multiple
				value={value}
				onChange={handleChange}
				input={<OutlinedInput id={`select-chip-${name}`} label={label} />}
				renderValue={(selected) => (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				MenuProps={MenuProps}
			>
				{data.map((item) => (
					<MenuItem key={item} value={item}>
						{item}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

export default ChipSelect
