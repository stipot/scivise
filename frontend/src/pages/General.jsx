import React, { useContext, useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import API from './../api'
import { AppContext } from '../context/AppContext'

function General() {
	const { articles, setArticles } = useContext(AppContext)
	const [page, setPage] = useState(1)

	function getArticles(page, startId) {
		const params = { page: page }
		if (startId) {
			params.start_id = startId
		}

		return API.get('/articles/', { params })
	}

	useEffect(() => {
		const lastArticleId = localStorage.getItem('last_article_id')
		const startId = lastArticleId ? Number(lastArticleId) + 1 : null
		getArticles(page, startId).then((res) => {
			console.log(res)
			setArticles((prev) => [...prev, ...res.data])
		})
		setPage((prev) => prev + 1)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.log(articles.length)

		if (articles.length && articles.length <= 5) {
			getArticles(page)
			setPage((prev) => prev + 1)
		}
	}, [articles]) // eslint-disable-line react-hooks/exhaustive-deps

	function move() {
		setArticles((prev) => prev.slice(1, prev.length))
	}

	return (
		<div className="general_page">
			<div className="article_card_list">
				{articles.length > 0 && 
					articles.map(article => (
						<ArticleCard article={article} move={move} />
					))
				}
			</div>
		</div>
	)
}

export default General
