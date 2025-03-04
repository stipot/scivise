import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import General from './pages/General'
import SavedArticles from './pages/SavedArticles'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import './App.css'
import { initDB } from './db'
import { StyledEngineProvider } from '@mui/material'
import ArticlePage from './pages/ArticlePage'
import { AppContext } from './context/AppContext'
import CollectionsPage from './pages/CollectionsPage'

function App() {
	const [articles, setArticles] = useState([])
	const [isDbInitialized, setIsDbInitialized] = useState(false)

	useEffect(() => {
		initDB().then(() => setIsDbInitialized(true))
	}, [])

	return (
		<AppContext.Provider value={{ articles, setArticles, isDbInitialized }}>
			<StyledEngineProvider injectFirst>
				<Router>
					<Header />
					<Routes>
						<Route path="/" element={<General />} />
						<Route path="/user/collections" element={<CollectionsPage />} />
						<Route
							path="/user/collections/:pageName"
							element={<SavedArticles />}
						/>
						<Route path="/article/:articleId" element={<ArticlePage />} />
						<Route path="/*" element={<NotFound />} />
						<Route path="/404" element={<NotFound />} />
					</Routes>
				</Router>
			</StyledEngineProvider>
		</AppContext.Provider>
	)
}

export default App
