import React, { useEffect } from 'react'
import { useParams, redirect } from 'react-router-dom'

function SavedArticles() {
	const params = useParams()

	const titles = {
		likes: 'Положительные оценки',
		dislikes: 'Отрицательные оценки',
		favorites: 'Избранные',
	}

	useEffect(() => {
		if (!Object.keys(titles).includes(params)) {
			redirect('/404')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="article_list">
			<h1>{titles.params}</h1>
		</div>
	)
}

export default SavedArticles
