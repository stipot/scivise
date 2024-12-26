import React, { useEffect, useState } from 'react'
import './ArticleCard.css'
import { addArticle } from '../db'

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
		<div className={`article_card ${transitionClass}`} style={style}>
			<div className="article_card_info">
				<p style={{ color: '#878787' }} className="article_card_info_magazine">
					{article.magazine} {article.publication_date}
				</p>
				<a href={article.link} target="_blank" rel="noopener noreferrer">
					<h4 className="article_card_info_title">{article.title}</h4>
				</a>

				<div className="article_card_info_authors">
					{article.authors.map((author) => (
						<p className="article_card_info_author" key={author.id}>
							{author.author_name}
						</p>
					))}
				</div>
				<p className="article_card_info_annonation">
					{article.type === 'news' ? (
						<>
							<strong>Содержание:</strong> {article.content.slice(0, 250)}...
						</>
					) : (
						<>
							<strong>Аннотация:</strong> {article.annotation}
						</>
					)}
				</p>
			</div>

			<div className="article_card_buttons">
				<button disabled={buttonDisabled} onClick={() => dislike()}>
					❌
				</button>
				{/* <button disabled={buttonDisabled}>⭐</button> */}
				<button disabled={buttonDisabled} onClick={() => like()}>
					❤️
				</button>
			</div>
		</div>
	)
}

export default ArticleCard
