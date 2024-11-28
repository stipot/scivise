import React, { useState } from 'react'
import ArticleCard from '../components/ArticleCard'

function General() {
	const mockArticles = [
		{
			title: 'Заголовок 1',
			authors: ['Автор1 Ф.А.'],
			annotation: 'addasdasssssssssssadasafafaf',
		},
		{
			title: 'Заголовок 2',
			authors: ['Автор2 Ф.А.'],
			annotation: 'addasdasssssssssssa21314124dasafafaf',
		},
		{
			title: 'Заголовок 3',
			authors: ['Автор2 Ф.А.'],
			annotation: 'addasdasssssssssssa21314124dasafafaf',
		},
		{
			title: 'Заголовок 4',
			authors: ['Автор2 Ф.А.'],
			annotation: 'addasdasssssssssssa21314124dasafafaf',
		},
	]
	const [articles, setArticles] = useState([])

	useState(() => {
		setArticles(mockArticles)
	}, [])

	function move() {
		setArticles((prev) => prev.slice(1, prev.length))
	}

	return (
		<div className="general_page">
			{articles.length > 0 && (
				<>
					<ArticleCard {...articles[0]} move={move} />

					{articles.length > 1 && (
						<ArticleCard {...articles[1]} move={move} style={{ zIndex: -1 }} />
					)}
				</>
			)}
		</div>
	)
}

export default General
