import { Card, Typography, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


function CollectionCard({ name, articlesCount, setCollectionName }) {
	return (
		<Card className="collection_card">
			<Link to={`/user/collections/${name}`}>
				<Typography variant="h5">{name}</Typography>
			</Link>
			<Typography>Сохранено статей: {articlesCount}</Typography>
			{name !== 'Дизлайки' && name !== 'Лайки' &&
			<> 
				<IconButton
					className="cross_button"
					onClick={() => setCollectionName(name)}
				>
					╳
				</IconButton>
				
			</>
			}
		</Card>
	)
}

export default CollectionCard
