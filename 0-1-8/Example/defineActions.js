module.exports = function(pep) {

	pep.defineAction(
		"readFile",
		function (session, response) {
			// TODO 
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
		"kunde:erstellen",
		function (session, response) {
			// TODO 
		},
		"transfer", ["versand:benachrichtigen"],
	); // kunde:erstellen

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

}; // module.exports