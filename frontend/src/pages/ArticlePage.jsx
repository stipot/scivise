import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Container, Toolbar, Box, Button } from '@mui/material'
import DislikeIcon from '../components/icons/DislikeIcon'
import LikeIcon from '../components/icons/LikeIcon'
import { Link, Navigate, useParams } from 'react-router-dom'
import { addArticle, getObjectStoresInfo } from '../db'
import SelectCollectionModal from '../components/SelectCollectionModal'

function ArticlePage() {
	const { articles, setArticles, isDbInitialized } = useContext(AppContext)
	let params = useParams()
	const article = articles.filter(
		(article) => article.id === parseInt(params.articleId)
	)[0]
	console.log(params, article)

	const [isButtonClicked, setIsButtonClicked] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [collections, setCollections] = useState(null)

	function getArticleIdx(articleId) {
		let articleIdx = 0
		articles.forEach((article, idx) => {
			if (article.id === articleId) {
				articleIdx = idx
			}
		})
		return articleIdx
	}

	async function like(collection, article) {
		await addArticle(collection, article)
		let articleIdx = getArticleIdx(article.id)

		for (let dislikedArticle of articles.slice(0, articleIdx)) {
			await addArticle('Дизлайки', dislikedArticle)
		}

		setArticles((prev) =>
			prev.slice(getArticleIdx(article.id) + 1, prev.length)
		)
		setIsButtonClicked(true)
	}

	useEffect(() => {
		if (!isDbInitialized) return

		getObjectStoresInfo().then((info) =>
			setCollections(
				info.filter((collection) => collection.name !== 'Дизлайки')
			)
		)
	}, [isDbInitialized])

	return (
		<>
			{collections && (
				<>
					<Container maxWidth="xl">
						<Toolbar
							disableGutters
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Link to="/" style={{ position: 'absolute', left: 0 }}>
								<Button>Назад</Button>
							</Link>
							<Box sx={{ display: 'flex', gap: '50px' }}>
								<Button
									className="dislike_button"
									onClick={() => {
										setIsButtonClicked(true)
										addArticle('Дизлайки', article)
										setArticles((prev) => prev.slice(1, prev.length))
									}}
								>
									<DislikeIcon />
								</Button>
								<Button
									className="like_button"
									onClick={() => {
										setOpenModal(true)
									}}
								>
									<LikeIcon />
								</Button>
							</Box>
						</Toolbar>
					</Container>
					{article && (
						<iframe
							title="article_page"
							src={article.link}
							style={{ width: '100%', height: 'calc(100vh - 140px)' }}
						></iframe>
					)}
					<SelectCollectionModal
						open={openModal}
						setOpen={setOpenModal}
						like={like}
						article={article}
						collections={collections}
					/>
					{isButtonClicked && <Navigate to="/" />}
				</>
			)}
		</>
	)
}

export default ArticlePage
