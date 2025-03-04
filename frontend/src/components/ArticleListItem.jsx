import { Card, Typography } from '@mui/material'
import React from 'react'

function ArticleListItem({ article }) {
	return (
		<Card className="article_list_item">
			<Typography className="article_card_info_magazine">
				{article.category}, {article.magazine}, {article.publication_date}
			</Typography>
			<a href={article.link} target="_blank" rel="noopener noreferrer">
				<Typography className="article_card_info_title">
					{article.title}
				</Typography>
			</a>

			<div className="article_card_info_authors">
				{article.authors.map((author) => (
					<Typography className="article_card_info_author" key={author.id}>
						{author.author_name}
					</Typography>
				))}
			</div>
			<div className="delete_article">X</div>
		</Card>
	)
}

export default ArticleListItem
