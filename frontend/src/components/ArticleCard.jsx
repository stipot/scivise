import React, { useEffect, useState, useContext } from 'react'
import './ArticleCard.css'
import { addArticle } from '../db'
import Card from '@mui/material/Card'
import { Button, Typography } from '@mui/material'
import LikeIcon from './icons/LikeIcon'
import DislikeIcon from './icons/DislikeIcon'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import SelectCollectionModal from './SelectCollectionModal'
import API from '../api'

function ArticleCard({ article, move, style, collections }) {
	const [transitionClass, setTransitionClass] = useState('')
	const [buttonDisabled, setButtonDisabled] = useState(false)
	const { articles, setArticles } = useContext(AppContext)
	const [openModal, setOpenModal] = useState(false)

	function getArticleIdx(articleId) {
		let articleIdx = 0
		articles.forEach((article, idx) => {
			if (article.id === articleId) {
				articleIdx = idx
			}
		})
		return articleIdx
	}

	function removeArticles(articleIdx) {
		setArticles((prev) => prev.slice(articleIdx + 1, prev.length))
	}

	async function like(collection, article) {
		setButtonDisabled(true)
		await addArticle(collection, article)
		let articleIdx = getArticleIdx(article.id)

		const articleIds = [article.id]
		for (let dislikedArticle of articles.slice(0, articleIdx)) {
			await addArticle('Дизлайки', dislikedArticle)
			articleIds.push(dislikedArticle.id)
		}
		await API.post('/articles/mark', {
			user_id: localStorage.getItem('user_id'),
			article_ids: articleIds,
		})
		setTransitionClass('article_card_moved_right')
	}

	async function dislike() {
		let articleIdx = getArticleIdx(article.id)
		const articleIds = []
		for (let dislikedArticle of articles.slice(0, articleIdx + 1)) {
			await addArticle('Дизлайки', dislikedArticle)
			articleIds.push(dislikedArticle.id)
		}
		await API.post('/articles/mark', {
			user_id: localStorage.getItem('user_id'),
			article_ids: articleIds,
		})
		setTransitionClass('article_card_moved_left')
	}

	useEffect(() => {
		if (
			['article_card_moved_right', 'article_card_moved_left'].includes(
				transitionClass
			)
		) {
			setButtonDisabled(true)
			const timeout = setTimeout(() => {
				setTransitionClass('article_card_moved_back')
				setTransitionClass('')
				removeArticles(getArticleIdx(article.id))
				localStorage.setItem('last_article_id', article.id)
				setButtonDisabled(false)
			}, 500)
			return () => timeout
		}
	}, [transitionClass]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		// <StyledEngineProvider injectFirst>
		<Card className={`article_card ${transitionClass}`} style={style}>
			<div className="article_card_info">
				<Typography className="article_card_info_magazine">
					{article.category}, {article.magazine}, {article.publication_date}
				</Typography>
				<Link to={`/article/${article.id}`} rel="noopener noreferrer">
					<Typography className="article_card_info_title" variant="h4">
						{article.title}
					</Typography>
				</Link>

				<div className="article_card_info_authors">
					{article.authors.map((author) => (
						<Typography className="article_card_info_author" key={author.id}>
							{author.author_name}
						</Typography>
					))}
				</div>
				<Typography className="article_card_info_annonation">
					{/* {article.type === 'news' ? (
						<>
							<strong>Содержание:</strong> {article.content.slice(0, 250)}...
						</>
					) : (
						<>
							<strong>Аннотация:</strong> {article.annotation}
						</>
					)} */}
					<strong>Аннотация:</strong> {article.annotation}...
				</Typography>
			</div>

			<div className="article_card_buttons">
				<Button
					variant="contained"
					className="dislike_button"
					disabled={buttonDisabled}
					onClick={async () => await dislike()}
				>
					<DislikeIcon />
				</Button>
				{/* <button disabled={buttonDisabled}>⭐</button> */}
				<Button
					variant="contained"
					className="like_button"
					disabled={buttonDisabled}
					onClick={() => setOpenModal(true)}
				>
					<LikeIcon />
				</Button>
			</div>
			<SelectCollectionModal
				open={openModal}
				setOpen={setOpenModal}
				like={like}
				article={article}
				collections={collections}
				disabled={buttonDisabled}
			/>
		</Card>
		// {/* </StyledEngineProvider> */}
	)
}

export default ArticleCard
