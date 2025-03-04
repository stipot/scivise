export function translit(word, lang) {
	const engToRu = {
		sch: 'щ',
		yo: 'ё',
		zh: 'ж',
		ch: 'ч',
		sh: 'ш',
		yu: 'ю',
		ya: 'я',
		a: 'а',
		b: 'б',
		v: 'в',
		g: 'г',
		d: 'д',
		e: 'е',
		z: 'з',
		i: 'и',
		y: 'й',
		k: 'к',
		l: 'л',
		m: 'м',
		n: 'н',
		o: 'о',
		p: 'п',
		r: 'р',
		s: 'с',
		t: 'т',
		u: 'у',
		f: 'ф',
		h: 'х',
		c: 'ц',
	}

	const ruToEng = {
		щ: 'sch',
		ё: 'yo',
		ж: 'zh',
		ч: 'ch',
		ш: 'sh',
		ю: 'yu',
		я: 'ya',
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		з: 'z',
		и: 'i',
		й: 'y',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'h',
		ц: 'c',
	}

	for (const [key, value] of Object.entries(
		lang === 'ru' ? engToRu : ruToEng
	)) {
		word = word.replaceAll(key, value)
	}

	return word
}
