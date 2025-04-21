import { useEffect, useState } from 'react'

const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handlerDebounceValue = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handlerDebounceValue)
		}
	}, [value]) // eslint-disable-line react-hooks/exhaustive-deps

	return debouncedValue
}

export default useDebounce
