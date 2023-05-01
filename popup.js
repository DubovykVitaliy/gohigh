const initPopup = (id, dataUrl) => {
	const states = document.getElementById(id)

	fetch(dataUrl)
		.then(response => response.json())
		.then(res => {
			handlePopup(res.states)
		})

	function handlePopup(dataR) {
		const data = dataR.filter(item => item.name)

		const setButtonWidth = data => {
			let len = 0
			data.forEach(item => {
				item.name.length > len && (len = item.name.length)
			})
			return len
		}
		//
		const isImage = el => {
			return el.img && el.img.length > 0
		}
		const addMessage = (newBtn, el) => {
			const message = document.createElement('span')

			message.textContent = 'No Image'
			newBtn.insertAdjacentElement('beforeend', message)
		}
		//
		const renderStates = el => {
			const html = `
				<div class="states__container" data-container></div>
					<div class="states__pop-up" data-popup>
					<div class="states__overlay" data-overlay></div>
					<button class="states__close" data-close></button>
				</div>
				`
			if (data && data.length > 0) {
				el.insertAdjacentHTML('afterbegin', html)

				states.style.setProperty('--name-length', `${setButtonWidth(data)}`)

				data.forEach((el, index) => {
					const newBtn = document.createElement('button')
					newBtn.classList.add('states__btn')
					newBtn.textContent = `${el.name}`
					newBtn.dataset.id = index

					!isImage(el) && addMessage(newBtn)

					states
						.querySelector('[data-container]')
						.insertAdjacentElement('beforeend', newBtn)
				})
			}
		}
		renderStates(states)

		const container = states.querySelector('[data-container]')
		const popUp = states.querySelector('[data-popup]')
		const closeEl = states.querySelector('[data-close]')

		const setPopupOrigin = e => {
			const left = e.target.getBoundingClientRect().left
			const wid = e.target.getBoundingClientRect().width
			const top = e.target.getBoundingClientRect().top
			const he = e.target.getBoundingClientRect().height
			popUp.style.transformOrigin = `${left + wid / 2}px ${top + he / 2}px`
		}

		const openPopup = (data, popUp, e) => {
			const previousActiveElement = document.activeElement
			const focusEl = popUp.querySelector('button')
			focusEl.focus()

			data.forEach((el, index) => {
				if (index == e.target.closest('[data-id]').dataset.id && el.img) {
					popUp.insertAdjacentHTML(
						'afterbegin',
						`
						<img src="${el.img}" alt="${el.alt}">
						`
					)
					setPopupOrigin(e)

					popUp.setAttribute('data-active', '')
				}
			})

			closeEl.addEventListener(
				'click',
				() => {
					closePopup(popUp, previousActiveElement)
				},
				{ once: true }
			)
		}

		const closePopup = (popUp, previousActiveElement) => {
			popUp.removeAttribute('data-active')
			previousActiveElement.focus()

			setTimeout(() => {
				popUp.querySelector('img')?.remove()
			}, 600)
		}

		container.addEventListener('click', e => {
			openPopup(data, popUp, e)
		})
	}
}

// * Calling this function with arguments:
//  1. html element ID
//  2. path to file where data stored

initPopup('states', './data.json')
