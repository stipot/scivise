import React, { useContext, useEffect, useState } from 'react'
import { Input, Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import './CollectionsPage.css'
import { getObjectStoresInfo, addObjectStore } from '../db'
import CollectionCard from '../components/CollectionCard'
import { AppContext } from '../context/AppContext'

function CollectionsPage() {
	const { register, handleSubmit, reset, formState } = useForm()
	const [collections, setCollections] = useState(null)
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

	return (
		<div className="collections_page">
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
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default CollectionsPage
