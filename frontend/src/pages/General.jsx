import React, { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import API from './../api'

function General() {
	const [articles, setArticles] = useState([])
	const [page, setPage] = useState(1)

	function getArticles(page, startId) {
		API.get('/articles/', { params: { page: page, start_id: startId } }).then(
			(res) => {
				console.log(res)

				setArticles((prev) => [...prev, ...res.data])
			}
		)
	}

	useEffect(() => {
		getArticles(page)
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
			{articles.length > 0 && (
				<>
					<ArticleCard article={articles[0]} move={move} />

					{articles.length > 1 && (
						<ArticleCard
							article={articles[1]}
							move={move}
							style={{ zIndex: -1 }}
						/>
					)}
				</>
			)}
		</div>
	)
}

export default General
