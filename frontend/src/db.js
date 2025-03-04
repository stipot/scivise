let version = 1

function createArticleStore(objectStore) {
	objectStore.createIndex('id', 'id', { unique: true })
	objectStore.createIndex('type', 'type')
	objectStore.createIndex('title', 'title')
	objectStore.createIndex('magazine', 'magazine')
	objectStore.createIndex('publication_date', 'publication_date')
	objectStore.createIndex('link', 'link')
	objectStore.createIndex('keywords', 'keywords')
	objectStore.createIndex('authors', 'authors')
	objectStore.createIndex('annotation', 'annotation')
	objectStore.createIndex('category', 'category')
	objectStore.createIndex('content', 'content')
}

export function initDB() {
	return new Promise((resolve) => {
		const request = indexedDB.open('scivise')

		request.onupgradeneeded = () => {
			const db = request.result
			if (!db.objectStoreNames.contains('likes')) {
				let objectStore = db.createObjectStore('likes', { keyPath: 'id' })
				createArticleStore(objectStore)
			}
			if (!db.objectStoreNames.contains('dislikes')) {
				let objectStore = db.createObjectStore('dislikes', { keyPath: 'id' })
				createArticleStore(objectStore)
			}
		}

		request.onsuccess = () => {
			const db = request.result
			version = db.version
			console.log('request.onsuccess - initDB', version)
			resolve(true)
		}

		request.onerror = () => {
			resolve(false)
		}
	})
}

export function addArticle(storeName, data) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('scivise', version)

		request.onsuccess = () => {
			console.log('request.onsuccess - addArticle', data)
			const db = request.result
			const tx = db.transaction(storeName, 'readwrite')
			const store = tx.objectStore(storeName)
			store.add(data)
			resolve()
		}

		request.onerror = () => {
			const error = request.error?.message
			if (error) {
				reject(error)
			} else {
				reject('Unknown error')
			}
		}
	})
}

export function getArticles(storeName, articleIds) {
	return new Promise((resolve) => {
		const request = indexedDB.open('scivise')

		request.onsuccess = () => {
			console.log('request.onsuccess - getArticles')
			const db = request.result
			const tx = db.transaction(storeName, 'readonly')
			const store = tx.objectStore(storeName)
			let res
			if (articleIds) {
				res = []
			} else {
				res = store.getAll()
			}

			res.onsuccess = () => {
				resolve(res.result)
			}
		}
	})
}

export function addObjectStore() {

}

export function getObjectStoresInfo() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('scivise', version)
		request.onsuccess = async () => {
			const db = request.result
			const info = await Promise.all(Array.from(db.objectStoreNames).map(async (storeName) => {
				const tx = db.transaction(storeName, 'readonly')
				const store = tx.objectStore(storeName)
				const res = store.getAll()
				const articlesCount = await new Promise(resolve => {
					res.onsuccess = () => {
						resolve(res.result.length)
					}
				}) 
				return {name: storeName, articlesCount: articlesCount}
			}))
			
			resolve(info)
		} 
	})
}