import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getArticles, removeArticle } from '../db'
import { Typography } from '@mui/material'
import ArticleListItem from '../components/ArticleListItem'
import './SavedArticles.css'

function SavedArticles() {
	const [articles, setArticles] = useState([])
	const params = useParams()

	// const titles = {
	// 	likes: 'Положительные оценки',
	// 	dislikes: 'Отрицательные оценки',
	// 	// favorites: 'Избранные',
	// }

	function removeFromCollection(articleId) {
		removeArticle(params.pageName, articleId).then(() =>
			setArticles((prev) => prev.filter((article) => article.id !== articleId))
		)
	}

	useEffect(() => {
		getArticles(params.pageName).then((res) => {
			console.log(res, articles.length)

			setArticles(res)
		})
	}, [params]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="saved_articles">
			{/* {!Object.keys(titles).includes(params.pageName) && <Navigate to="/404" />} */}

			<Typography variant="h1" sx={{ fontSize: 28 }}>
				{/* {titles[params.pageName]} */}
				{params.pageName}
			</Typography>
			{articles.length > 0 && (
				<ul className="article_list">
					{articles.map((article) => (
						<li key={article.id}>
							<ArticleListItem
								article={article}
								removeFromCollection={removeFromCollection}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default SavedArticles
