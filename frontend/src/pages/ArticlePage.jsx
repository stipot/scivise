import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Container, Toolbar, Box, Button } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import DislikeIcon from '../components/icons/DislikeIcon'
import LikeIcon from '../components/icons/LikeIcon'
import { Link, Navigate, useParams } from 'react-router-dom'
import { addArticle, getObjectStoresInfo } from '../db'
import SelectCollectionModal from '../components/SelectCollectionModal'
import API from '../api'
import CopyIcon from '../components/icons/CopyIcon';

function ArticlePage() {
	const { articles, setArticles, isDbInitialized } = useContext(AppContext)
	let params = useParams()

	const [isButtonClicked, setIsButtonClicked] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [collections, setCollections] = useState(null)
	const [article, setArticle] = useState(null)
	const [openBar, setOpenBar] = useState(false)

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

	function handleCopy() {
		const url = `${window.location.protocol}//${window.location.host}/${params.articleId}`
		navigator.clipboard.writeText(url).then(() => {
			setOpenBar(true)
		  })
	}

	useEffect(() => {
		if (articles.length > 0) {
			setArticle(articles.filter(
				(article) => article.id === parseInt(params.articleId)
			)[0])
		} else {
			API.get('/articles/', {params: {article_id: [parseInt(params.articleId)]}})
			.then(res => setArticle(res.data))
		}
		
	}, [])

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
			{collections && article &&(
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
								<Button
									variant="outlined"
									onClick={handleCopy}
									sx={{position: 'absolute', right: 0, width: '30px', height: '42px'}}
								>
									<CopyIcon/>
								</Button>

								<Snackbar
									open={openBar}
									autoHideDuration={2000}
									message="Ссылка скопирована"
									onClose={() => setOpenBar(false)}
								/>
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
