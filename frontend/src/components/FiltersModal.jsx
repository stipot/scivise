import { Box, Modal, FormControl, Typography, Button } from '@mui/material'
import React from 'react'
import ChipSelect from './ChipSelect'

function FiltersModal({ open, handleClose, keywords, authors, categories }) {
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
				>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="categories"
							data={categories}
							dataField=""
							label="Категории"
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="authors"
							data={authors}
							dataField=""
							label="Авторы"
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="keywords"
							data={keywords}
							dataField=""
							label="Ключевые слова"
						/>
					</FormControl>
					<Button variant="contained" sx={{ marginTop: '10px' }}>
						Применить
					</Button>
				</form>
			</Box>
		</Modal>
	)
}

export default FiltersModal
