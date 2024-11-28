import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

function Header() {
	const { login } = useContext(AppContext)

	return (
		<div className="header">
			<h2>Rewrite</h2>
			<div className="pages">
				<Link></Link>
				<Link></Link>
			</div>
			<div className="search">
				<input type="text" />
				<button>
					<img
						src="https://img.icons8.com/?size=100&id=59878&format=png&color=000000"
						alt=""
					/>
				</button>
			</div>
			<div className="user_part">
				<h4>{login}</h4>
				<button>Выйти</button>
			</div>
		</div>
	)
}

export default Header
