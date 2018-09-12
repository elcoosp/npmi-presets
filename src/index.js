#!/usr/bin/env node
const inquirer = require('inquirer')
const throttle = require('lodash.throttle')
const Npm = require('./Npm')
const Store = require('./Store')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

const P = {
	presetName: {
		name: 'presetName',
		message: 'Preset name :'
	},
	shouldAddMorePkgs: (type = '') => ({
		name: 'shouldAddMorePkgs',
		type: 'confirm',
		message: `Add another ${type} package ?`
	}),
	selectedPkg: (type = '') => ({
		type: 'autocomplete',
		name: 'selectedPkg',
		message: `Type a ${type} package then select it to add to the preset`,
		source: throttle(
			async (answersSoFar, input) => Npm.search(input || '', 6),
			1000
		)
	})
}

const getSelectedPackages = async (type, askAgain = true, pkgs = []) => {
	if (!askAgain) return pkgs
	const { selectedPkg, shouldAddMorePkgs } = await inquirer.prompt([
		P.selectedPkg(type),
		P.shouldAddMorePkgs(type)
	])
	return getSelectedPackages(type, shouldAddMorePkgs, pkgs.concat(selectedPkg))
}
;(async () => {
	console.log(Store.get('presets'))

	const { presetName } = await inquirer.prompt([P.presetName])
	const deps = await getSelectedPackages('REGULAR DEPENDENCY')
	const devDeps = await getSelectedPackages('DEV DEPENDENCY')
	Store.addPreset(presetName, {
		deps,
		devDeps
	})
	console.log(Store.get('presets'))
})()
