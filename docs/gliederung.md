# Policy-basiertes Zugriffs-Management für Webserver unter Node.js

## Einleitung und Zielsetzung
(Das soll noch nicht die tatsächliche Zielsetzung sein, nur ein erster Überblick)
NodeJS ist eine großartige Laufzeit-Umgebung für Entwickler von Server-Platformen durch seine Funktionalität, Asynchronität und Modularität. Dank des Node-Package-Managers (npm) ist es ein Leichtes, Module von anderen Entwicklern in das eigene Projekt einzubinden, um sich das Programmieren zu erleichtern. Die verbreitesten Module sind wohl Express (zum erstellen von Web-Servern) und Socket.io (zum erstellen von Echtzeit-Anwendungen).
Wer einen Web-Server betreibt muss sich jedoch zwangläufig über Authentifizierung und Autorisierung gedanken machen. Hier wird die Anzahl an möglichen Modulen schon eingeschränkter, die Rollen- oder Attributbasierte-Autorisierung ermöglichen. Die meisten erfordern zudem, dass Rollen einprogrammiert werden, was zu statischen Anwendungen und mehr Aufwand für die Programmierer führt, um später Änderungen zu machen.
Eine Policy-basierte Autorisierung findet sich so gut wie gar nicht, obwohl man dadurch eine höhere Dynamik, größere Übersichtlichkeit und einfachere Handhabung erreicht. Eine Umsetzung ist ziemlich schwierig, dabei gibt es Modelle, die im Detail beschreiben, wie solche Policies aussehen könnten, um alle Wünsche des Programmierers offen zu lassen.
Eine Option hierbei ist die ODRL (Open Digital Rights Language), die sowohl Rollen- (Parties) als auch Attribut-basierte (Contraints) Autorisierung zulässt. Um Server-Anfragen korrekt abzuarbeiten und die Anforderungen der ODRL einzuhalten, benötigt es eines durchdachten Vorgehens. Hier könnte XACML (eXtensible Access Control Markup Language) eine Hilfe sein. Obwohl dies auch eine Policy-Sprache ist, empfielt sie zusätzlich eine Server-Architektur, nach der die Anfragen abgearbeitet werden. Der Vorteil der ODRL im Vergleich zur XACML ist der Umfang der Policies, sowie der Fakt, dass nicht XML als Format verwendet wird, sondern das für JavaScript komfortablere JSON-Format (natürlich könnte man auch für die XACML eine "companion specification" in JSON machen).
Die Architektur der XACML, welche sich in vielen Online-Services sowie neuesten Entwicklungen in der Industrie wiederfindet (Axiomatic, Ind2uce, etc), kombiniert mit der Syntax der ODRL, welche vom W3C entwickelt wurde, könnte eine gute Basis für Policy-basierte Autorisierung sein.

Aus diesem Grund soll das Ziel der Arbeit die Untersuchung der beiden Modelle in Hinsicht auf die Entwicklung eines Node-Moduls sein, welches JavaScript-Entwickler dazu nutzen können, Policy-basierte Autorisierung auf ihren Web-Servern durchzuführen, sowie Access-Management, Usage-Control und Nachweisbarkeit von Rechten ohne großen Aufwand zu gewährleisten.

## Use-Cases
- Server-Anwendung für Betriebe mit z.B. Waren-Transport. Erfassung durch Scanner (o.ä.) und Übermittlung an Server. Webanwendung zur Darstellung der Abläufe und Analysen. Verschiedene Mitarbeiter haben, je nach Aufgabenbereich, verschiedene Anwendungen zur Verfügung.
- Foren-Anwendung mit unterschiedlichen User-Gruppen und Admins.
- etc.

## Informationsmodelle

### Open Digital Rights Language (ODRL)
- (ODRL 2.2 - Information Model)[https://www.w3.org/TR/odrl-model/]
- (ODRL 2.2 - Vocabulary & Expression)[https://www.w3.org/TR/2018/REC-odrl-vocab-20180215/]

### eXtensible Access Control Markup Language (XACML)
- (XACML 3.0 - Specification)[http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html]
- (Axiomatics - XACML Reference Architecture)[https://www.axiomatics.com/blog/xacml-reference-architecture/]
- (WSO2 - Access Control - XACML)[https://docs.wso2.com/display/IS570/Access+Control+and+Entitlement+Management]
- (Fraunhofer - IND2UCE Framework)[https://www.iese.fraunhofer.de/de/competencies/security/ind2uce-framework.html]

## Entwicklungsumgebung

### Node.js
- (Node.js - Home)[https://nodejs.org/en/]
- (Node.js - About)[https://nodejs.org/en/about/]
- (Express - Home)[https://expressjs.com/de/]
- (Socket.io - Home)[https://socket.io/]

### Neo4j
- (Neo4j - Home)[https://neo4j.com/]
- (Neo4j - Top Ten Reasons)[https://neo4j.com/top-ten-reasons/]
- (Neo4j - Identity & Access Management)[https://neo4j.com/use-cases/identity-and-access-management/]
- (Neo4j - Cypher Refcard)[https://neo4j.com/docs/cypher-refcard/current/]

### MongoDB
- (MongoDB - Home)[https://www.mongodb.com/]
- (MongoDB - Data as a Service)[https://www.mongodb.com/initiatives/data-as-a-service]
- (MongoDB - Content Management)[https://www.mongodb.com/use-cases/content-management]

## Umsetzung

### Kombination der Modelle
- Matching der Begrifflichkeiten
- Was aus welchem Modell genommen
- Unterschiede der Modelle

### Abweichungen vom Modell
- ContextHandler (XACML)
- Aktionen (ODRL)
- ODRL für Server-Policies statt Digital Rights

#### Einsparung aus Komplexitätsgründen
- Contraints (ODRL)
- ConflictTerm (ODRL)
- Inheritance (ODRL)
- Obligations (ODRL)

### Besondere Anforderungen
- Ausführung von definierten Aktionen auf einem Asset, statt Preisgabe des gesamten Assets
- Suche der zutreffenden Policies im Graphen
- Implementation als Node-Package
- Erweiterung der Funktionalität durch Vererbung der Klassen (z.B. PEP direkt als Socket.io Schnittstelle)
- Auditieren für Fehler-Analysen
- Unmissverständliches (mindestens leicht verständliches) Interface

### Implementation
- Klassen-Diagramm der Module
- Aufbau des Request- und Response-Context
- Sequenz-Diagramm einer Anfrage

### Verbesserungen für die Zukunft
- XACML Architektur-Modell verändern für bessere Verarbeitung von Anfragen
- Informationen von Resources und Subjects auch in Neo4j, statt in extra PIP
- GraphQL als Schnittstelle zu Neo4j in Betracht ziehen
    - (Neo4j - GraphQL)[https://neo4j.com/developer/graphql/]
    - (GraphQL - Introduction)[https://graphql.github.io/learn/]

## Re­sü­mee
- Sehr brauchbares Projekt für Server-Applikationen :)
- ODRL als sehr geeignete Policy-Sprache und bestens einzubetten in Neo4j
- Implementation ist keine leichte Aufgabe! (vor allem, wenn man alle Features umsetzen will)
- Bisher schwach besetzte Niesche im OpenSource-Sektor