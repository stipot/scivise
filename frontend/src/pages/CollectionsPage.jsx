import React, { useContext, useEffect, useState } from 'react'
import { Input, Button, Modal, Box, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import './CollectionsPage.css'
import { getObjectStoresInfo, addObjectStore, initDB, deleteDB } from '../db'
import CollectionCard from '../components/CollectionCard'
import { AppContext } from '../context/AppContext'
import { deleteCollection } from '../db'

function CollectionsPage() {
	const { register, handleSubmit, reset, formState } = useForm()
	const [collections, setCollections] = useState(null)
	const [collectionForDelete, setCollectionForDelete] = useState('')
	const { isDbInitialized } = useContext(AppContext)

	function createCollection(data) {
		addObjectStore(data.name).then(() =>
			setCollections((prev) => [...prev, { name: data.name, articlesCount: 0 }])
		)
		reset()
	}

	useEffect(() => {
		if (!isDbInitialized) return

		getObjectStoresInfo().then((info) => setCollections(info))
	}, [isDbInitialized])

	const handleClose = () => setCollectionForDelete('')

	return (
		<div className="collections_page">
			<Button
				onClick={async () => {
					await deleteDB()
					await initDB()
					localStorage.setItem('last_article_id', null)
					localStorage.setItem('db_version', 1)
				}}
			>
				Переустановить БД
			</Button>
			<form
				className="create_collection_form"
				onSubmit={handleSubmit(createCollection)}
			>
				<Input
					placeholder="Название подборки"
					{...register('name', { required: true })}
				/>
				<Button variant="contained" type="submit" disabled={!formState.isValid}>
					Создать
				</Button>
			</form>
			{collections != null && (
				<div className="collections_list">
					{collections.map((collection) => (
						<CollectionCard
							key={collection.name}
							name={collection.name}
							articlesCount={collection.articlesCount}
							setCollectionName={setCollectionForDelete}
						/>
					))}
				</div>
			)}

				<Modal open={Boolean(collectionForDelete)} onClose={handleClose}>
					<Box className="modal_content" sx={{display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center'}}>
						<Typography variant='h4'>Все оценки пропадут</Typography>
						<Button color='error' variant='outlined' onClick={async () => {
							await deleteCollection(collectionForDelete)
							setCollections(prev => prev.filter(collection => collection.name !== collectionForDelete))
							console.log(collections);
							
							setCollectionForDelete('')
						}}>Удалить</Button>
					</Box>
				</Modal>
		</div>
		
	)
}

export default CollectionsPage
