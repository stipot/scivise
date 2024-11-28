import React, { useEffect, useState } from 'react'
import './ArticleCard.css'

function ArticleCard({ title, authors, annotation, move, style }) {
	const [transitionClass, setTransitionClass] = useState('')
	const [buttonDisabled, setButtonDisabled] = useState(false)
	function like() {
		setTransitionClass('article_card_moved_right')
	}

	function dislike() {
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
				move()
				setButtonDisabled(false)
			}, 500)
			return () => timeout
		}
	}, [transitionClass]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={`article_card ${transitionClass}`} style={style}>
			<div className="article_card_info">
				<h3 className="article_card_info_title">{title}</h3>
				<div className="article_card_info_authors">
					{authors.map((author) => (
						<p className="article_card_info_author">{author}</p>
					))}
				</div>
				<p className="article_card_info_annonation">
					<strong>Аннотация:</strong> {annotation}
				</p>
			</div>

			<div className="article_card_buttons">
				<button disabled={buttonDisabled} onClick={() => dislike()}>
					❌
				</button>
				<button disabled={buttonDisabled}>⭐</button>
				<button disabled={buttonDisabled} onClick={() => like()}>
					❤️
				</button>
			</div>
		</div>
	)
}

export default ArticleCard
