const audioApi = 'https://api.quran.sutanlab.id/surah/'
const tafsirApi = 'https://quranenc.com/api/translation/sura/uzbek_mansour/'
let allAudios

async function renderAyats (event) {
	const inputValue = inputElement.value.trim()

	if(
		event.keyCode != 13 || 
		!inputValue || 
		inputValue > 114 || 
		inputValue < 1
	) return

	let [audioResult, tafsirResult] = await Promise.all([
		fetch(audioApi + inputValue),
		fetch(tafsirApi + inputValue)
	])

	audioResult = await audioResult.json()
	tafsirResult = await tafsirResult.json()

	const nameSurah = audioResult.data.name.transliteration.en
	const audioVerses = audioResult.data.verses
	const tafsirVerses = tafsirResult.result

	allAudios = audioVerses

	surahName.textContent = nameSurah

	list.innerHTML = null
	for(let i in audioVerses) {
		const ayatText = audioVerses[i].text.arab
		const ayatAudio = audioVerses[i].audio.primary
		const ayatTafsir = tafsirVerses[i].translation

		const li = document.createElement('li')
		const h2 = document.createElement('h2')
		const h4 = document.createElement('h4')

		h2.textContent = ayatText
		h4.textContent = ayatTafsir

		li.append(h2, h4)
		list.append(li)

		li.onclick = () => {
			stopAudios()

			const audio = document.createElement('audio')
			audioWrapper.append(audio)
			audio.src = ayatAudio
			audio.play()
		}
	}
}

async function stopAudios () {
	const audios = document.querySelectorAll('#audioWrapper audio')
	audios.forEach(audio => {
		audio.pause()
		audio.remove()
	})
}

async function readAllAyats (event, i = 0) {
	if(!allAudios) return

	stopAudios()

	const elements = document.querySelectorAll('#list li')
	elements[i].style.backgroundColor = 'gray'

	const ayatAudio = allAudios[i].audio.primary
	const audio = document.createElement('audio')
	audioWrapper.append(audio)
	audio.src = ayatAudio
	audio.play()

	audio.onended = () => {
		elements[i].style.backgroundColor = 'transparent'

		if(!allAudios[i + 1]) return

		return readAllAyats(null, ++i)
	}
}


inputElement.onkeyup = renderAyats
readAll.onclick = readAllAyats