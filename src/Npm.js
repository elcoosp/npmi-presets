const fetch = require('node-fetch')
module.exports = {
	search: async (term, size) =>
		fetch(`https://registry.npmjs.com/-/v1/search?text=${term}&size=${size}`)
			.then(res => res.json())
			.then(data => data.objects.map(o => o.package.name))
}
