import { Box, Modal, FormControl, Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChipSelect from './ChipSelect'
import API from '../api'
import useDebounce from '../useDebounce'

function FiltersModal({
	open,
	handleClose,
	// keywords,
	// authors,
	// categories,
	filterValues,
	setFilterValues,
	formState,
	setFormState,
	setIsFormSubmitted,
}) {
	const [keywordsInput, setKeywordsInput] = useState(null)
	const [authorsInput, setAuthorsInput] = useState(null)
	const debounceKeywords = useDebounce(keywordsInput, 600)
	const debounceAuthors = useDebounce(authorsInput, 600)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		;['categories', 'authors', 'keywords'].forEach((filterName) => {
			API.get('/articles/filter_values', {
				params: { filter_name: filterName },
			}).then((res) => {
				console.log(res.data)
				setFilterValues((prev) => {
					return { ...prev, [filterName]: res.data }
				})
			})
		})

		return () => {}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setLoading(true)
	}, [keywordsInput, authorsInput])

	useEffect(() => {
		if (!debounceKeywords === null && debounceAuthors === null) return

		let filterName
		let startValue

		if (debounceAuthors !== null) {
			filterName = 'authors'
			startValue = debounceAuthors
			if (debounceAuthors === '') setAuthorsInput(null)
		}

		if (debounceKeywords !== null) {
			filterName = 'keywords'
			startValue = debounceKeywords
			if (keywordsInput === '') setKeywordsInput(null)
		}

		if (!filterName) return

		const params = { filter_name: filterName }
		if (startValue) {
			params.start_val = startValue
		}

		API.get('/articles/filter_values', { params })
			.then((res) => {
				console.log(res.data)
				setFilterValues((prev) => {
					return { ...prev, [filterName]: res.data }
				})
			})
			.finally(() => setLoading(false))
	}, [debounceKeywords, debounceAuthors]) // eslint-disable-line react-hooks/exhaustive-deps

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
							data={filterValues.categories}
							dataField=""
							label="Категории"
							setState={setFormState}
							state={formState.categories}
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="authors"
							data={filterValues.authors}
							dataField=""
							label="Авторы"
							setState={setFormState}
							state={formState.authors}
							setInputState={setAuthorsInput}
							loading={loading}
						/>
					</FormControl>
					<FormControl sx={{ m: 1, width: 330 }}>
						<ChipSelect
							name="keywords"
							data={filterValues.keywords}
							dataField=""
							label="Ключевые слова"
							setState={setFormState}
							state={formState.keywords}
							setInputState={setKeywordsInput}
							loading={loading}
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
