const data = [
	{
		id: 'backblaze',
		min_price: 7,
		storage_price: 0.005,
		transfer_price: 0.01,
		bg_color: '#B22222',
	},
	{
		id: 'bunny',
		max_price: 10,
		storage_price: {
			hdd: 0.01,
			ssd: 0.02,
		},
		transfer_price: 0.01,
		bg_color: '#FF8C00',
	},
	{
		id: 'scaleway',
		storage_price: {
			multi: 0.06,
			single: 0.03,
		},
		storage_free: 75,
		transfer_price: 0.02,
		transfer_free: 75,
		bg_color: '#7F00FF',
	},
	{
		id: 'vultr',
		min_price: 5,
		storage_price: 0.01,
		transfer_price: 0.01,
		bg_color: '#00BFFF',
	},
]

const MAX_VALUE = 100 //max value of price

const ranges = document.querySelectorAll('.range_wrapper')

let priceArr = [] // price array with current values of each provider

/* 

updateChartValue - function get values from range sliders and calculate final price for each provider

char_data - settings for current provider,
range_data - object with values from range sliders

*/
const UpdateChartValue = (chartData, rangeData) => {
	const { transfer, storage } = rangeData
	const {
		id,
		min_price,
		max_price,
		storage_price,
		transfer_price,
		storage_free,
		transfer_free,
		bg_color,
	} = chartData
	const chartWrapper = document.querySelector(`#${id}`)
	const chart = chartWrapper.querySelector('.chart span')
	const priceNode = chartWrapper.querySelector('.price')
	let storagePrice
	let transferPrice = transfer_free
		? transfer < transfer_free
			? 0
			: transfer_price * (transfer - transfer_free)
		: transfer * transfer_price

	if (storage_free && storage < storage_free) {
		storagePrice = 0
	} else {
		if (typeof storage_price === 'object' && !Array.isArray(storage_price)) {
			const radioBtnValue = chartWrapper.querySelector(
				'input[type=radio]:checked'
			).value
			storagePrice =
				storage_price[radioBtnValue] *
				(storage_free ? storage - storage_free : storage)
		} else if (typeof storage_price === 'number') {
			storagePrice =
				storage_price * (storage_free ? storage - storage_free : storage)
		}
	}

	const price = Math.floor((storagePrice + transferPrice) * 100) / 100

	let finalPrice = 0

	if (min_price) {
		finalPrice = price < min_price ? min_price : price
	} else if (max_price) {
		finalPrice = price > max_price ? max_price : price
	} else {
		finalPrice = price
	}

	chart.setAttribute(
		'style',
		`--percent: ${(finalPrice / MAX_VALUE) * 100}%;
    --bg_color: ${bg_color};`
	)
	priceNode.innerHTML = `${finalPrice}$`
	priceArr.push({ id: id, value: finalPrice })
}

/*

updateCharts - function which update charts

*/
const updateCharts = () => {
	const storage = document.querySelector('input#storage')
	const transfer = document.querySelector('input#transfer')
	const calcData = {
		storage: storage.value,
		transfer: transfer.value,
	}
	priceArr = []
	data.map(item => UpdateChartValue(item, calcData))
	const minValueChart = priceArr.sort((a, b) => a.value - b.value)[0]
	document.querySelector('.min-price')?.classList.remove('min-price')
	document
		.querySelector(`#${minValueChart.id} .chart span`)
		.classList.add('min-price')
}

const radioBtnList = document.querySelectorAll('input[type=radio]')
radioBtnList.forEach(item => {
	item.addEventListener('change', () => {
		updateCharts()
	})
})

updateCharts()

ranges.forEach(item => {
	const rangeInput = item.querySelector('input')
	const rangeLabel = item.querySelector('.range_value')
	rangeInput.addEventListener('input', e => {
		rangeLabel.innerHTML = e.target.value
		updateCharts()
	})
})
