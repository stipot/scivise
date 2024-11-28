import React from 'react'
import './ArticleCard.css'

function ArticleCard() {
	return (
		<div className="article_card">
			<div className="article_card_info">
				<h3 className="article_card_info_title">Заголовок статьи</h3>
				<div className="article_card_info_authors">
					<p className="article_card_info_author">Автор А. А.</p>
					<p className="article_card_info_author">Автор А. А.</p>
					<p className="article_card_info_author">Автор А. А.</p>
					<p className="article_card_info_author">Автор А. А.</p>
				</div>
				<p className="article_card_info_annonation">
					<strong>Аннотация:</strong> Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Repudiandae itaque nam facilis, ipsam eum impedit,
				</p>
			</div>

			<div className="article_card_buttons">
				<button>❌</button>
				<button>⭐</button>
				<button>❤️</button>
			</div>
		</div>
	)
}

export default ArticleCard
