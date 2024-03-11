
const flags = {
    'USD' : "static/flags/usa_flag.png",
    'UAH' : "static/flags/ukrain_flag.jpg",
    'AUD': "static/flags/australia_flag.png",
    'AMD': "static/flags/armenia_flag.png",
    'BGN': "static/flags/bulgaria_flag.png",
    'BRL': "static/flags/brazil_flag.png",
    'EUR': "static/flags/europe_flag.png",
    'AED': "static/flags/oae_flag.png",
    'DKK': "static/flags/danimarca_flag.jpg",
    'RUB': "static/flags/russia_flag.jpg",
    'VND': "static/flags/vietnam_flag.png",
    'JPY': "static/flags/japan_flag.png",
    'CNY': "static/flags/china_flag.png",
    'PLN':"static/flags/poland_flag.png",
    'INR':"static/flags/india_flag.png",
    'IRR':"static/flags/iran_flag.png",
    'ISK':"static/flags/iceland_flag.png",
    'CAD':"static/flags/canada_flag.png",
    'KZT':"static/flags/kazakhstan_flag.png",
    'KWD':"static/flags/kuwait_flag.png",
    'MDL':"static/flags/moldova_flag.png",
    'NZD':"static/flags/new_zealand_flag.png",
    'NOK':"static/flags/norway_flag.png",
    'SGD':"static/flags/singapore_flag.png",
    'KGS':"static/flags/kyrgyzstan_flag.png",
    'CHF':"static/flags/switzerland_flag.png",
    'SEK':"static/flags/sweden_flag.png",
    'CZK':"static/flags/czech_flag.png",
    'GBP':"static/flags/united_kingdom_flag.png",
    'TRY':"static/flags/turkey_flag.png",

}

const currentCurrency = {}

const setCurrencyCourse = () => {

    const list_currency = document.querySelector('.list_currency-items')
    const list_currency_select = document.getElementsByTagName('select').item(0)

    getCourseValues().then(data => {
        data.filter(item => item.Cur_Abbreviation !== 'XDR')
            .forEach(item => {
            const list_item = document.createElement('li')
            const option_item = document.createElement('option')

            const flag = document.createElement('img')
            flag.src = flags[item.Cur_Abbreviation]

            const name = document.createElement('p')
            name.innerHTML = `${item.Cur_Name}<span> ${item.Cur_Scale} ${item.Cur_Abbreviation} </span>`

            const value = document.createElement('div')
            value.innerText = item.Cur_OfficialRate.toFixed(2) + ' BYN'

            option_item.value = item.Cur_OfficialRate
            option_item.textContent = item.Cur_Abbreviation
            list_item.appendChild(flag)
            list_item.appendChild(name)
            list_item.appendChild(value)

            list_currency.appendChild(list_item)
            list_currency_select.appendChild(option_item)
            currentCurrency[item.Cur_Abbreviation] = [item.Cur_OfficialRate, item.Cur_Scale]

        });
    });

    setListenerToChangeFlags()

}


const convert = () => {
    const currency = document.getElementsByTagName('select').item(0);
    const value = document.getElementsByTagName('input').item(0);

    const result_field = document.querySelector('.convert-field.result')
    const data_field = document.querySelector('.convert-field.data')

    const current_flag_to = document.querySelector('.current_flag_to');
    console.log(current_flag_to.src)

    const currency_abbr = currency.options[currency.selectedIndex].text
    if(current_flag_to.src.endsWith('static/flag.png'))
    {
        data_field.textContent = value.value + ' BYN'
        result_field.textContent = (Number(value.value) / currency.value * currentCurrency[currency_abbr][1]).toFixed(2) + ' ' + currency_abbr
    }

    else {
        data_field.textContent = value.value + ' ' + currency_abbr
        result_field.textContent = (Number(value.value) * currency.value / currentCurrency[currency_abbr][1]).toFixed(2) + '  BYN'

    }

    setExtraInfoCurrency()
};


const changeFlags = () => {
    const current_flag_to = document.querySelector('.current_flag_to');
    const current_flag_into = document.querySelector('.current_flag_into');

    const tempSrc = current_flag_to.src;
    current_flag_to.src = current_flag_into.src;
    current_flag_into.src = tempSrc;

    convert()
};

const setExtraInfoCurrency = () =>
{
    const extraInfo = document.querySelectorAll('.extra-info-list-currency li')
    const current_flag_to = document.querySelector('.current_flag_to');
    const popular_currency = ['USD', 'EUR', 'UAH', 'RUB', 'CNY']
    const value_data = document.getElementsByTagName('input').item(0)
    const result_field = document.querySelector('.convert-field.result')
    extraInfo.forEach((item, index) => {
            const values = item.getElementsByTagName('span')

            const current_course = currentCurrency[popular_currency[index]][0]
            const current_currency = currentCurrency[popular_currency[index]][1]
            if (current_flag_to.src.endsWith('static/flag.png')) {
                values[1].textContent = value_data.value + ' BYN'
                values[0].textContent = (current_course * Number(value_data.value) / current_currency).toFixed(2) + ' ' + popular_currency[index]
            } else {
                values[1].textContent = result_field.textContent
                values[0].textContent = (parseFloat(result_field.textContent) / current_course  * current_currency).toFixed(2) + ' ' + popular_currency[index]
            }
        }
    )


}




const getCourseValues = async () => {
    try {
        const response = await fetch('https://api.nbrb.by/exrates/rates?periodicity=0');

        return response.json();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
};


window.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        convert();
    }
});

const setListenerToChangeFlags = () =>
{
    const list_currency_select = document.getElementsByTagName('select').item(0)
    list_currency_select.addEventListener('change', function () {

        const current_flag_to = document.querySelector('.current_flag_to')
        const current_flag_into = document.querySelector('.current_flag_into')
        const selectedOption = list_currency_select.options[list_currency_select.selectedIndex];
        if(current_flag_to.src.endsWith('static/flag.png'))
        {
            current_flag_into.src = flags[selectedOption.text];
        }

        else current_flag_to.src = flags[selectedOption.text];

        convert();
    })
}
