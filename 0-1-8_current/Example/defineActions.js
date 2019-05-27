const
	Path = require('path'),
	Fs = require('fs'),
	_promify = (fn, ...args) => new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));

module.exports = function (pep) {

	pep.defineAction(
		"readFile",
		async function (session, response) {
			let target = await this.target();

			if (target['@type'] !== "File")
				throw new Error(`The asset-type ${target['@type']} is not supported by readFile`);

			let fileBuffer = await _promify(Fs.readFile, Path.join(__dirname, target.path));
			response.type(target.mimeType).send(fileBuffer);
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

	const _listMembers = {
		'Ware': [
			"deathstar-2.10.7",
			"cantina-fanshirt"
		]
	};

	pep.defineAction(
		"listMembers",
		async function (session) {
			let target = await this.target();

			if (target['@type'] !== "Collection")
				throw new Error(`The asset-type ${target['@type']} is not supported by listMembers`);
			if (!_listMembers[target['@id']])
				throw new Error(`collection ${target['@id']} unknown`);

			let
				memberIDs = _listMembers[target['@id']],
				members = await Promise.all(memberIDs.map((id) => new Promise(async (resolve, reject) => {
					try {
						let result = await pep.request({
							action: 'use',
							target: {
								'@type': target['@id'],
								'@id': id
							},
							assignee: this.assignee
						}, session);
						resolve(result);
					} catch (err) {
						console.error(err);
						resolve();
					}
				})));

			return members.filter(val => val);
		},
		"use", [],
	); // listMembers

	pep.defineAction(
		"kunde:auflisten",
		async function (session, response) {
			let members = await this.target();
			let output = members
				.filter(ware => parseInt(ware.bestand) > 0)
				.map(ware => ({
					'Bezeichnung': ware.bezeichnung,
					'Preis': ware.preis
				}));

			response.type('json').send(output);
		},
		"listMembers", [],
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