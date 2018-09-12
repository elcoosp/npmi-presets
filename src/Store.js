const Configstore = require('configstore')
const pkg = require('../package.json')

const store = new Configstore(pkg.name, { presets: {} })

const merge = (key, data) => store.set(key, { ...store.get(key), ...data })

module.exports = {
	get: store.get,
	addPreset: (presetName, preset) => merge('presets', { [presetName]: preset })
}
