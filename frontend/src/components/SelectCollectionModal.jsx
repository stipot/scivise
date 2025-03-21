import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

function SelectCollectionModal({
	open,
	setOpen,
	like,
	article,
	collections,
	disabled,
}) {
	const handleClose = () => setOpen(false)

	return (
		<Modal open={open} onClose={handleClose}>
			<Box className="modal_content">
				<Typography variant="h5" sx={{ textAlign: 'center' }}>
					Выберите подборку
				</Typography>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						alignItems: 'center',
						marginTop: '20px',
					}}
				>
					{collections.map((collection) => (
						<Button
							sx={{
								width: '300px',
								padding: '10px',
							}}
							variant="outlined"
							onClick={async () => await like(collection.name, article)}
							key={collection.name}
							disabled={disabled}
						>
							<Typography variant="h6">{collection.name}</Typography>
						</Button>
					))}
				</div>
			</Box>
		</Modal>
	)
}

export default SelectCollectionModal
