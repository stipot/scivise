import React, { useContext, useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import API from './../api'
import { AppContext } from '../context/AppContext'
import { getObjectStoresInfo } from '../db'

function General() {
	const { articles, setArticles, isDbInitialized } = useContext(AppContext)
	const [page, setPage] = useState(1)
	const [collections, setCollections] = useState(null)

	function getArticles(page) {
		const params = { page: page, user_id: localStorage.getItem('user_id') }

		return API.get('/articles/', { params })
	}

	useEffect(() => {
		if (!isDbInitialized) return

		getObjectStoresInfo().then((info) =>
			setCollections(
				info.filter((collection) => collection.name !== 'Дизлайки')
			)
		)
	}, [isDbInitialized])

	useEffect(() => {
		if (articles.length) return

		getArticles(page).then((res) => {
			console.log(res)
			setArticles((prev) => [...prev, ...res.data])
		})
		setPage((prev) => prev + 1)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.log(articles.length)

		if (articles.length && articles.length <= 5) {
			getArticles(page).then((res) => {
				console.log(res)
				setArticles((prev) => [...prev, ...res.data])
			})
			setPage((prev) => prev + 1)
		}
	}, [articles]) // eslint-disable-line react-hooks/exhaustive-deps

	function move(articleId) {
		let articleIdx = 0
		articles.forEach((article, idx) => {
			if (article.id === articleId) {
				articleIdx = idx
			}
		})
		setArticles((prev) => prev.slice(articleIdx + 1, prev.length))
	}

	return (
		<div className="general_page">
			<div className="article_card_list">
				{articles.length > 0 &&
					collections &&
					articles.map((article) => (
						<ArticleCard
							article={article}
							move={move}
							key={article.id}
							collections={collections}
						/>
					))}
			</div>
		</div>
	)
}

export default General
