import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AppContext } from './context/AppContext'
import PrivateRoute from './components/PrivateRouter'
import Login from './pages/Login'
import General from './pages/General'
import SignUp from './pages/SignUp'
import SavedArticles from './pages/SavedArticles'

function App() {
	const [isAuth, setIsAuth] = useState(false)

	return (
		<AppContext.Provider
			value={{
				isAuth,
				setIsAuth,
			}}
		>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/sign_up" element={<SignUp />} />
					<Route element={<PrivateRoute isAuth={isAuth} />}>
						<Route path="/" element={<General />} />
						<Route path="/saved_articles" element={<SavedArticles />} />
					</Route>
				</Routes>
			</Router>
		</AppContext.Provider>
	)
}

export default App
