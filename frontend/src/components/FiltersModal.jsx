import { Box, Modal, FormControl, Typography, Button } from '@mui/material'
import React from 'react'
import ChipSelect from './ChipSelect'

function FiltersModal({
	open,
	handleClose,
	keywords,
	authors,
	categories,
	formState,
	setFormState,
	setIsFormSubmitted,
}) {
	function submit(e) {
		e.preventDefault()
		console.log(formState)
		setIsFormSubmitted(true)
		handleClose(false)
	}
	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				className="modal_content"
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography variant="h5" sx={{ textAlign: 'center' }}>
					Фильтры
				</Typography>
				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						maxHeight: 400,
						overflow: 'auto',
					}}
					onSubmit={submit}
				>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="categories"
							data={categories}
							dataField=""
							label="Категории"
							setState={setFormState}
							state={formState.categories}
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="authors"
							data={authors}
							dataField=""
							label="Авторы"
							setState={setFormState}
							state={formState.authors}
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="keywords"
							data={keywords}
							dataField=""
							label="Ключевые слова"
							setState={setFormState}
							state={formState.keywords}
						/>
					</FormControl>
					<Button variant="contained" sx={{ marginTop: '10px' }} type="submit">
						Применить
					</Button>
				</form>
			</Box>
		</Modal>
	)
}

export default FiltersModal
