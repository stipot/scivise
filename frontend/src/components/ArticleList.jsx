import React from 'react'
import ArticleListItem from './ArticleListItem'
import './ArticleList.css'

function ArticleList({ articles }) {
	return (
		<ul className="article_list">
			{articles.map((article) => (
				<li key={article.id}>
					<ArticleListItem article={article} />
				</li>
			))}
		</ul>
	)
}

export default ArticleList
