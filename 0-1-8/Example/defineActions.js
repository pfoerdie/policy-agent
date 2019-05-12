const
	Path = require('path'),
	Fs = require('fs'),
	_promify = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));

module.exports = function (pep) {

	pep.defineAction(
		"readFile",
		async function (session, response) {
			if (this.target['@type'] !== "File")
				throw new Error(`The asset-type ${this.target['@type']} is not supported by readFile`);

			let fileBuffer = await _promify(Fs.readFile, Path.join(__dirname, this.target.path));
			response.type(this.target.mimeType).send(fileBuffer);
		},
		"use", [],
	); // readFile

	pep.defineAction(
		"login",
		function (session, response) {
			// TODO 
		},
		"use", [],
	); // login

	pep.defineAction(
		"logout",
		function (session, response) {
			// TODO 
		},
		"use", [],
	); // logout

	pep.defineAction(
		"listMembers",
		function (session, response) {
			// TODO 
		},
		"use", [],
	); // listMembers

	pep.defineAction(
		"kunde:auflisten",
		function (session, response) {
			// TODO 
		},
		"use", ["listMembers"],
	); // kunde:auflisten

	pep.defineAction(
		"versand:aktualisieren",
		function (session, response) {
			// TODO 
		},
		"transfer", [],
	); // versand:aktualisieren

	pep.defineAction(
		"versand:benachrichtigen",
		function (session, response) {
			// TODO 
		},
		"use", [],
	); // versand:benachrichtigen

	pep.defineAction(
		"einkauf:bearbeiten",
		function (session, response) {
			// TODO 
		},
		"transfer", [],
	); // einkauf:bearbeiten

	pep.defineAction(
		"einkauf:anzeigen",
		function (session, response) {
			// TODO 
		},
		"use", ["listMembers"],
	); // einkauf:anzeigen

	pep.defineAction(
		"buchhaltung:summieren",
		function (session, response) {
			// TODO 
		},
		"use", ["listMembers"],
	); // buchhaltung:summieren

	pep.defineAction(
		"scanner:verbuchen",
		function (session, response) {
			// TODO 
		},
		"transfer", [],
	); // scanner:verbuchen

	pep.defineAction(
		"scanner:registrieren",
		function (session, response) {
			// TODO 
		},
		"use", [],
	); // scanner:registrieren

	pep.defineAction(
		"zeiterfassung:erfassen",
		function (session, response) {
			// TODO 
		},
		"transfer", [],
	); // zeiterfassung:erfassen

	pep.defineAction(
		"zeiterfassung:aktualisieren",
		function (session, response) {
			// TODO 
		},
		"transfer", [],
	); // zeiterfassung:aktualisieren

	pep.defineAction(
		"kunde:erstellen",
		function (session, response) {
			// TODO 
		},
		"transfer", ["versand:benachrichtigen"],
	); // kunde:erstellen

}; // module.exports