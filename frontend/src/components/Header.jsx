import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
	return (
		<div className="header">
			<h2>Scivise</h2>
			{/* <div className="pages">
				<Link>Рекоммендации</Link>
				<Link>Библиотека</Link>
				<Link>Избранное</Link>
			</div> */}
			<div className="search">
				<input type="text" />
				<button>
					<img
						src="https://img.icons8.com/?size=100&id=59878&format=png&color=000000"
						alt=""
					/>
				</button>
			</div>
		</div>
	)
}

export default Header
