import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { getArticles } from '../db'

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

			<h1>{titles[params.pageName]}</h1>
			{articles.length > 0 && <ArticleList articles={articles} />}
		</div>
	)
}

export default SavedArticles
