import { Box, Modal, FormControl, Typography} from '@mui/material'
import React from 'react'
import ChipSelect from './ChipSelect'

function FiltersModal({open, handleClose}) {
  return (
    <Modal open={open} onClose={handleClose}>
        <Box className="modal_content">
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
                Фильтры
            </Typography>
            <FormControl sx={{ m: 1, width: 300 }}>
                <ChipSelect name='authors' data={[]} dataField='' label='Авторы' />
            </FormControl>
        </Box>
    </Modal>
  )
}

export default FiltersModal