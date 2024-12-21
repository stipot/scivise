import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import General from './pages/General'
import SavedArticles from './pages/SavedArticles'
import NotFound from './pages/NotFound'
import Header from './components/Header'

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<General />} />
				<Route path="/user/*" element={<SavedArticles />} />
				<Route path="/*" element={<NotFound />} />
				<Route path="/404" element={<NotFound />} />
			</Routes>
		</Router>
	)
}

export default App
