const quoteParagraph = document.querySelector('.quote');
const authorSpan = document.querySelector('.author span');
const typingArea = document.querySelector('.typing-area');
const timeParagraph = document.querySelector('.time');
const popup = document.querySelector('.popup');
const popupBtn = document.querySelector('.popup-btn');
const shadow = document.querySelector('.shadow');
const medal = document.querySelector('.fa-medal')

let time;
let timeInterval;

const url = 'https://api.quotable.io/random';

function getQuote() {
	return fetch(url).then((data) => data.json());
}

function displayQuote() {
	getQuote().then((data) => {
		authorSpan.textContent = data.author;
		quoteParagraph.textContent = data.content;
	});
	typingArea.addEventListener('keydown', timer);
}

function compare() {
	typingArea.removeEventListener('keydown', timer);
	const quote = quoteParagraph.textContent.split('');
	const typedLetters = typingArea.value.split('');
	quoteParagraph.textContent = '';

	quote.forEach((character, index) => {
		const letterSpan = document.createElement('span');
		letterSpan.textContent = character;
		quoteParagraph.append(letterSpan);

		if (typedLetters[index] == null) {
			letterSpan.classList.remove('correct');
			letterSpan.classList.remove('incorrect');
		} else if (character === typedLetters[index]) {
			letterSpan.classList.add('correct');
			letterSpan.classList.remove('incorrect');
		} else if (character !== typedLetters[index]) {
			letterSpan.classList.remove('correct');
			letterSpan.classList.add('incorrect');
		}
	});

	if (quote.toString() == typedLetters.toString()) {
		typingArea.value = '';
		showPopup();
		displayQuote();
	}
}

function timer() {
	clearInterval(timeInterval);
	time = new Date();
	timeInterval = setInterval(() => {
		timeParagraph.textContent = Math.floor((new Date() - time) / 1000) || 0;
	}, 1000);
}

function showPopup() {
	const quote = quoteParagraph.textContent.split('');
	const paragraphOne = popup.children[0].children[0];
	const paragraphTwo = popup.children[0].children[1];
	const speed = quote.length / timeParagraph.textContent

	popup.style.display = 'flex';
	shadow.style.display = 'block';
	paragraphOne.textContent = `You typed ${quote.length} signs in ${timeParagraph.textContent}s`;
	paragraphTwo.textContent = `Speed: ${speed.toFixed(1)} /s`;
	
	timeParagraph.textContent = '0';
	
	if (speed < 3) medal.style.color = '#824A02'
	if (speed >= 3) medal.style.color = 'silver'
	if (speed >= 6) medal.style.color = 'gold';

	clearInterval(timeInterval);

	popupBtn.addEventListener('click', closePopup);
	window.addEventListener('keydown', closePopup);
}

const closePopup = (e) => {
	if (e.key === 'Enter' || e.type === 'click') {
		popup.style.display = 'none';
		shadow.style.display = 'none';
		e.preventDefault();
		typingArea.focus();
		clearInterval(timeInterval)
	}
};

displayQuote();

typingArea.addEventListener('input', compare);
