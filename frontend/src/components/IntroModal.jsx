import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

function IntroModal() {
  return (
    <Modal open={open} onClose={handleClose}>
			<Box className="modal_content">
				<Typography variant="h5" sx={{ textAlign: 'center' }}>
					Выберите интересующие теги
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
				</div>
			</Box>
		</Modal>
  )
}

export default IntroModal