import { Card, IconButton, Typography } from '@mui/material'
import React from 'react'

function ArticleListItem({ article, removeFromCollection = null }) {
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
					<Typography
						className="article_card_info_author"
						key={typeof author === 'string' ? author : author.id}
					>
						{typeof author === 'string' ? author : author.author_name}
					</Typography>
				))}
			</div>
			{removeFromCollection && (
				<IconButton
					className="cross_button"
					onClick={async () => await removeFromCollection(article.id)}
				>
					╳
				</IconButton>
			)}
		</Card>
	)
}

export default ArticleListItem
