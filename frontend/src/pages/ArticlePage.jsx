import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Container, Toolbar, Box, Button } from '@mui/material'
import DislikeIcon from '../components/icons/DislikeIcon'
import LikeIcon from '../components/icons/LikeIcon'
import { Link, Navigate } from 'react-router-dom'
import { addArticle } from '../db'

function ArticlePage() {
	const { articles, setArticles } = useContext(AppContext)
	const article = articles[0]
	const [isButtonClicked, setIsButtonClicked] = useState(false)

	return (
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
					<Box sx={{ display: 'flex', gap: '100px' }}>
						<button
							className="dislike_button"
							onClick={() => {
								setIsButtonClicked(true)
								addArticle('dislikes', article)
								setArticles((prev) => prev.slice(1, prev.length))
							}}
						>
							<DislikeIcon />
						</button>
						<button
							className="like_button"
							onClick={() => {
								setIsButtonClicked(true)
								addArticle('likes', article)
								setArticles((prev) => prev.slice(1, prev.length))
							}}
						>
							<LikeIcon />
						</button>
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

			{isButtonClicked && <Navigate to="/" />}
		</>
	)
}

export default ArticlePage
