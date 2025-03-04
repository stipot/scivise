import { Card, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function CollectionCard({ name, articlesCount }) {
	return (
		<Card className="collection_card">
			<Link to={`/user/collections/${name}`}>
				<Typography variant="h5">{name}</Typography>
			</Link>
			<Typography>Сохранено статей: {articlesCount}</Typography>
		</Card>
	)
}

export default CollectionCard
