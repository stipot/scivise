import React, { useEffect, useState } from 'react'
import './ArticleCard.css'
import { addArticle } from '../db'
import Card from '@mui/material/Card'
import { Button, Typography } from '@mui/material'
import LikeIcon from './icons/LikeIcon'
import DislikeIcon from './icons/DislikeIcon'
import { Link } from 'react-router-dom'

function ArticleCard({ article, move, style }) {
	const [transitionClass, setTransitionClass] = useState('')
	const [buttonDisabled, setButtonDisabled] = useState(false)

	function like() {
		addArticle('likes', article).then(() => {
			setTransitionClass('article_card_moved_right')
		})
	}

	function dislike() {
		addArticle('dislikes', article).then(() => {
			setTransitionClass('article_card_moved_left')
		})
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
				move()
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
					{article.type === 'news' ? (
						<>
							<strong>Содержание:</strong> {article.content.slice(0, 250)}...
						</>
					) : (
						<>
							<strong>Аннотация:</strong> {article.annotation}
						</>
					)}
				</Typography>
			</div>

			<div className="article_card_buttons">
				<Button
					variant="contained"
					className="dislike_button"
					disabled={buttonDisabled}
					onClick={() => dislike()}
				>
					<DislikeIcon />
				</Button>
				{/* <button disabled={buttonDisabled}>⭐</button> */}
				<Button
					variant="contained"
					className="like_button"
					disabled={buttonDisabled}
					onClick={() => like()}
				>
					<LikeIcon />
				</Button>
			</div>
		</Card>
		// {/* </StyledEngineProvider> */}
	)
}

export default ArticleCard
