import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticles, removeArticle } from '../db'
import { Typography } from '@mui/material'
import ArticleListItem from '../components/ArticleListItem'
import './SavedArticles.css'
import API from '../api'

function SavedArticles() {
	const [articles, setArticles] = useState([])
	const params = useParams()

	async function removeFromCollection(articleId) {
		await removeArticle(params.pageName, articleId)
		await API.delete('/articles/mark', {
			data: {
				user_id: localStorage.getItem('user_id'),
				article_ids: [articleId],
			},
		})

		setArticles((prev) => prev.filter((article) => article.id !== articleId))
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
