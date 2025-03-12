// function createArticleStore(objectStore) {
// 	objectStore.createIndex('id', 'id', { unique: true })
// 	objectStore.createIndex('type', 'type')
// 	objectStore.createIndex('title', 'title')
// 	objectStore.createIndex('magazine', 'magazine')
// 	objectStore.createIndex('publication_date', 'publication_date')
// 	objectStore.createIndex('link', 'link')
// 	objectStore.createIndex('keywords', 'keywords')
// 	objectStore.createIndex('authors', 'authors')
// 	objectStore.createIndex('annotation', 'annotation')
// 	objectStore.createIndex('category', 'category')
// 	objectStore.createIndex('content', 'content')
// }

export function initDB() {
	return new Promise((resolve) => {
		const request = indexedDB.open(
			'scivise',
			Number(localStorage.getItem('db_version')) || 1
		)

		request.onupgradeneeded = () => {
			const db = request.result
			if (!db.objectStoreNames.contains('Лайки')) {
				// let objectStore = db.createObjectStore('likes', { keyPath: 'id' })
				// createArticleStore(objectStore)
				db.createObjectStore('Лайки', { keyPath: 'id' })
			}
			if (!db.objectStoreNames.contains('Дизлайки')) {
				// let objectStore = db.createObjectStore('dislikes', { keyPath: 'id' })
				// createArticleStore(objectStore)
				db.createObjectStore('Дизлайки', { keyPath: 'id' })
			}
		}

		request.onsuccess = () => {
			const db = request.result
			console.log('request.onsuccess - initDB', db.version)
			localStorage.setItem('db_version', db.version)
			db.close()
			resolve(true)
		}

		request.onerror = () => {
			resolve(false)
		}
	})
}

export function deleteDB() {
	return new Promise((resolve) => {
		var req = indexedDB.deleteDatabase('scivise')
		req.onsuccess = () => resolve()
	})
}

export function addArticle(storeName, data) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(
			'scivise',
			Number(localStorage.getItem('db_version'))
		)

		request.onsuccess = () => {
			console.log('request.onsuccess - addArticle', data)
			const db = request.result
			const tx = db.transaction(storeName, 'readwrite')
			const store = tx.objectStore(storeName)
			store.add(data)
			db.close()
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

export function removeArticle(storeName, articleId) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(
			'scivise',
			Number(localStorage.getItem('db_version'))
		)

		request.onsuccess = () => {
			const db = request.result
			const tx = db.transaction(storeName, 'readwrite')
			tx.objectStore(storeName).delete(articleId)
			tx.oncomplete = () => {
				db.close()
				resolve()
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
				db.close()
				resolve(res.result)
			}
		}
	})
}

export function addObjectStore(storeName) {
	return new Promise((resolve) => {
		const version = Number(localStorage.getItem('db_version'))
		const request = indexedDB.open('scivise', version + 1)
		localStorage.setItem('db_version', version + 1)
		request.onupgradeneeded = async () => {
			const db = request.result
			db.createObjectStore(storeName, { keyPath: 'id' })
			db.close()
			resolve()
		}
	})
}

export function getObjectStoresInfo() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(
			'scivise',
			Number(localStorage.getItem('db_version'))
		)
		request.onsuccess = async () => {
			const db = request.result
			const info = await Promise.all(
				Array.from(db.objectStoreNames).map(async (storeName) => {
					const tx = db.transaction(storeName, 'readonly')
					const store = tx.objectStore(storeName)
					const res = store.getAll()
					const articlesCount = await new Promise((resolve) => {
						res.onsuccess = () => {
							resolve(res.result.length)
						}
					})
					return { name: storeName, articlesCount: articlesCount }
				})
			)
			db.close()

			resolve(info)
		}
	})
}
