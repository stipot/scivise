import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'

function SavedArticles() {
	const params = useParams()

	const titles = {
		likes: 'Положительные оценки',
		dislikes: 'Отрицательные оценки',
		favorites: 'Избранные',
	}

	useEffect(() => {
		if (!Object.keys(titles).includes(params.pageName)) {
		}
		console.log(params.pageName)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="article_list">
			{!Object.keys(titles).includes(params.pageName) && <Navigate to="/404" />}

			<h1>{titles[params.pageName]}</h1>
		</div>
	)
}

export default SavedArticles
