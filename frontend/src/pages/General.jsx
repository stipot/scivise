import React, { useContext, useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import API from './../api'
import { AppContext } from '../context/AppContext'
import { getObjectStoresInfo } from '../db'
import { Button } from '@mui/material'
import FiltersModal from '../components/FiltersModal'

function General() {
	const { articles, setArticles, isDbInitialized } = useContext(AppContext)
	const [page, setPage] = useState(1)
	const [collections, setCollections] = useState(null)
	const [stopRequesting, setStopRequesting] = useState(false)
	const [openFilters, setOpenFilters] = useState(false)
	const [filterValues, setFilterValues] = useState({
		keywords: [],
		categories: [],
		authors: [],
	})
	const [formState, setFormState] = useState({
		authors: [],
		categories: [],
		keywords: [],
	})
	const [isFormSubmitted, setIsFormSubmitted] = useState(false)

	function getArticles(page, articleIds) {
		const params = {
			page: page,
			user_id: localStorage.getItem('user_id'),
		}

		if (articleIds) {
			params.article_ids = articleIds
		}

		if (formState.keywords) {
			params.keywords = formState.keywords
		}
		if (formState.categories) {
			params.categories = formState.categories
		}
		if (formState.authors) {
			params.authors = formState.authors
		}

		return API.get('/articles/', { params })
	}

	useEffect(() => {
		API.get('/articles/filters_values').then((res) => {
			console.log(res.data)
			setFilterValues(res.data)
		})
		return () => {}
	}, [])

	useEffect(() => {
		if (!isDbInitialized) return

		getObjectStoresInfo().then((info) =>
			setCollections(
				info.filter((collection) => collection.name !== 'Дизлайки')
			)
		)
	}, [isDbInitialized])

	useEffect(() => {
		if (articles.length <= 5 && !stopRequesting) {
			const articleIds = articles.map((article) => article.id)

			getArticles(page, articleIds).then((res) => {
				if (res.data.length === 0) {
					setStopRequesting(true)
				}
				setArticles((prev) => [...prev, ...res.data])
			})
			setPage((prev) => prev + 1)
		}
	}, [articles]) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isFormSubmitted) {
			getArticles().then((res) => {
				console.log(res.data)

				setArticles(res.data)
			})
			setIsFormSubmitted(false)
		}
	}, [isFormSubmitted]) // eslint-disable-line react-hooks/exhaustive-deps

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
			<Button onClick={() => setOpenFilters(true)}>Фильтры</Button>
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
			<FiltersModal
				open={openFilters}
				handleClose={() => setOpenFilters(false)}
				categories={filterValues.categories}
				authors={filterValues.authors}
				keywords={filterValues.keywords}
				formState={formState}
				setFormState={setFormState}
				setIsFormSubmitted={setIsFormSubmitted}
			/>
		</div>
	)
}

export default General
