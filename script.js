import currencies from './data/currencies.js'

const amount = document.getElementById('amount')
const fromCurrency = document.getElementById('from-currency')
const toCurrency = document.getElementById('to-currency')
const selects = document.querySelectorAll('select')
const swapButton = document.getElementById('swap-button')
const result = document.getElementById('result')
const currencyList = document.getElementById('currency-list')

function populateCurrencySelects () {
  for (const select of selects) {
    for (const currencyCode in currencies) {
      const option = document.createElement('option')
      option.value = currencyCode
      option.textContent = `${currencyCode} - ${currencies[currencyCode].currencyName}`
      select.appendChild(option)
    }
  }
}

function updateFlags (select) {
  const flagImg =
    select.id === 'from-currency'
      ? document.getElementById('from-flag')
      : document.getElementById('to-flag')

  if (currencies[select.value]) {
    flagImg.src = currencies[select.value].flag
    flagImg.style.display = 'inline'
  } else {
    flagImg.style.display = 'none'
  }
}

function displayCurrencyList () {
  // Display table header
  currencyList.innerHTML = `
    <div class="currency-item">
      <span class="currency-code">Código</span>
      <span class="currency-name">Nombre</span>
      <span class="currency-country">País</span>
      <span class="currency-rate">Tasa</span>
    </div>
  `
  for (const currencyCode in currencies) {
    const currency = currencies[currencyCode]

    const div = document.createElement('div')
    div.classList.add('currency-item')

    const img = document.createElement('img')
    img.src = currency.flag
    img.alt = `Bandera de la divisa ${currency.currencyName}`
    img.width = 32

    const spanCode = document.createElement('span')
    spanCode.classList.add('currency-code')
    spanCode.textContent = currencyCode

    const spanName = document.createElement('span')
    spanName.classList.add('currency-name')
    spanName.textContent = currency.currencyName

    /* country */
    const spanCountry = document.createElement('span')
    spanCountry.classList.add('currency-country')
    spanCountry.textContent = currency.country

    const spanRate = document.createElement('span')
    spanRate.classList.add('currency-rate')
    spanRate.textContent = `1 USD = ${currency.rate} ${currencyCode}`

    div.appendChild(img)
    div.appendChild(spanCode)
    div.appendChild(spanName)
    div.appendChild(spanCountry)
    div.appendChild(spanRate)

    currencyList.appendChild(div)
  }
}

amount.addEventListener('blur', (e) => {
  const val = parseFloat(e.target.value)
  e.target.value = isNaN(val) ? '0.00' : val.toFixed(2)
})

function convert () {
  let amountValue = parseFloat(amount.value)
  if (isNaN(amountValue)) amountValue = 0

  if (!currencies[fromCurrency.value] || !currencies[toCurrency.value]) {
    result.innerHTML = 'Datos inválidos'
    return
  }

  const fromRate = currencies[fromCurrency.value].rate
  const toRate = currencies[toCurrency.value].rate

  const convertedAmount = (amountValue / fromRate) * toRate

  result.innerHTML = `
    <p id="conversion-amount">${amountValue.toFixed(2)} ${
    fromCurrency.value
  } =</p>
    <p id="conversion-result">${convertedAmount.toFixed(2)} ${
    toCurrency.value
  }</p>
    <p id="conversion-rate">1 ${fromCurrency.value} = ${(
    toRate / fromRate
  ).toFixed(5)} ${toCurrency.value}</p>
  `
}

selects.forEach((select) => {
  select.addEventListener('change', (e) => {
    updateFlags(e.target)
    convert()
  })
})

amount.addEventListener('input', convert)

swapButton.addEventListener('click', () => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
  updateFlags(fromCurrency)
  updateFlags(toCurrency)
  convert()
})

window.addEventListener('load', () => {
  populateCurrencySelects()

  amount.value = '1.00'
  fromCurrency.value = 'USD'
  toCurrency.value = 'EUR'

  updateFlags(fromCurrency)
  updateFlags(toCurrency)
  displayCurrencyList()
  convert()
})
