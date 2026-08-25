const production = 'production'
const local = 'dev'

const local_api_url = 'https://e-news-main.onrender.com'
const production_api_url = 'https://e-news-dkp7.onrender.com'

const mode = production

let base_api_url = ''

if (mode === production) {
    base_api_url = production_api_url
} else {
    base_api_url = local_api_url
}

export { base_api_url, base_api_url as base_url }