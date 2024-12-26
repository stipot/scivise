import React from 'react'

function ArticleListItem({ article }) {
	return (
		<div className="article_list_item">
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
		</div>
	)
}

export default ArticleListItem
