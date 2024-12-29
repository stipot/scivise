import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { getArticles } from '../db'
import { Typography } from '@mui/material'

function SavedArticles() {
	const [articles, setArticles] = useState([])
	const params = useParams()

	const titles = {
		likes: 'Положительные оценки',
		dislikes: 'Отрицательные оценки',
		// favorites: 'Избранные',
	}

	useEffect(() => {
		getArticles(params.pageName).then((res) => {
			console.log(res, articles.length)

			setArticles(res)
		})
	}, [params]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="saved_articles">
			{!Object.keys(titles).includes(params.pageName) && <Navigate to="/404" />}

			<Typography variant="h1" sx={{ fontSize: 28 }}>
				{titles[params.pageName]}
			</Typography>
			{articles.length > 0 && <ArticleList articles={articles} />}
		</div>
	)
}

export default SavedArticles
