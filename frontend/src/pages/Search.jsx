import React, { useState } from 'react'
import ArticleListItem from '../components/ArticleListItem'
import { Button, Typography, TextField, Box } from '@mui/material'
import API from '../api'
import SearchIcon from '../components/icons/SearchIcon'

function Search() {
	const [articles, setArticles] = useState(null)
	const [searchPhrase, setSearchPhrase] = useState('')
	const [isEnd, setIsEnd] = useState(true)
	const [lastSort, setLastSort] = useState([])

	async function searchArticles(searchPhrase, searchAfter = null) {
		setIsEnd(true)
		const params = { search_phrase: searchPhrase }
		if (searchAfter && searchAfter.length === 2) {
			params.last_sort = lastSort.join('_')
		}
		const res = await API.get('/articles/search', { params })
		setArticles((prev) =>
			searchAfter === null ? res.data.articles : [...prev, ...res.data.articles]
		)
		setLastSort(res.data.last_sort)
		setIsEnd(res.data.end)
	}

	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '10px',
					marginTop: '15px',
				}}
			>
				<TextField
					id="outlined-basic"
					label="Поиск"
					variant="outlined"
					size="small"
					onChange={(e) => setSearchPhrase(e.target.value)}
				/>
				<Button
					onClick={() => searchArticles(searchPhrase)}
					variant="contained"
				>
					<SearchIcon
						style={{
							width: '25px',
							height: '25px',
							fill: 'white',
							strokeWidth: 3,
							stroke: 'white',
						}}
					/>
				</Button>
			</div>
			{articles && articles.length === 0 && (
				<Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
					Ничего не найдено
				</Typography>
			)}
			{articles && articles.length > 0 && (
				<ul className="article_list">
					{articles.map((article) => (
						<li key={article.id}>
							<ArticleListItem article={article} />
						</li>
					))}
				</ul>
			)}
			{!isEnd && (
				<Box textAlign="center">
					<Button
						variant="outlined"
						sx={{ margin: '20px 0' }}
						onClick={() => searchArticles(searchPhrase, lastSort)}
					>
						Далее
					</Button>
				</Box>
			)}
		</div>
	)
}

export default Search