## Anwendungsname

Todo App Timo

## Name

Timo von Arx

## Planung

### Projekt Setup **1.5 Stunden**

- Neues NestJS Projekt erstellen
- Auth Module (Users) aus bestehendem Projekt migrieren
- Swagger Dokumentation einrichten
- Globaler Prefix setzen (/api)
- Git Repository initialisieren (freiwillig mit Remote Repository verknüpfen)
- Intercepters migerieren
- Environment File konfigurieren

> Kommentar: Die Erstellung ging schneller als erwartet, ich war bereits nach etwa 0.5-1 Stunde fertig.

### Datenbank erstellen und mit Backend Verknüpfen **1 Stunden**

- SQLLite Datenbank einrichten
- TypeORM konfigurieren
- Todo Entitys erstellen
- Modul Ressourcen (Controller, Service, usw) Erstellen/Generieren für TODOs

> Kommentar: Hier habe ich in der Planung vergessen die DTOs zu erwähnen ich habe diese gleich mit den Entitys erstellt. Dazu habe ich etwas länger gehabt da ich noch den todo-seed Service implementiert habe.

### TODO Funktionalität implementieren **2 Stunden**

- REST Endpunkte für TODOs erstellen
- Module Ressourcen Anpassen um CRUD Operationen zu gewährleisten (Erstellen, Löschen, Aktualisieren und Rückgabe)
- Berechtigungen Umsetzen
- Korrekte HTTP Statuscodes zurückgeben

> Kommentar: Hier ist mehrheitlich alles nach Plan gelaufen. Ich habe hier etwa 2 Stunden gebraucht.

### Validierung und Dokumentation **0.5 Stunde**

- Decorators für Validierung hinzufügen
- Swagger Dokumentation erweitern / vervollständigen

> Kommentar: Die Validierung und die Dokumentation ging exakt etwa 0.5 Stunden, ich hatte keine Probleme.

### Testing **1.5 Stunden**

- E2E Tests mit Postman ausführen
- Unit-Tests für Services umsetzen (Todo-Service, Auth-Service)
- Überprüfung der Testabdeckung (coverage)

> Kommentar: Die Tests haben etwas länger gedauert als geplant, da es einige Fehler gab, die ich beheben musste. Insgesamt hat es jedoch trotzdem geklappt.

### Pufferzeit **1 Stunde**

- Um Probleme zu lösen
- Um den Code zu überprüfen und vielleicht Optimierungen vornehmen

> Kommentar: Die Pufferzeit habe ich nicht gross benötigt, lediglich für das Fazit und Zusätzliches

## Fazit

Die Anbindung der Datenbank in das Backend sowie die Arbeit mit Entities und DTOs hat ziemlich gut funktioniert. Auch das Aufsetzen von Swagger verlief problemlos und ich konnte mich somit mehrheitlich gut an meine Planung halten.
Schwierigkeiten hatte ich vor allem bei den E2E Tests. Am Anfang sind viele Tests gefailt, ich konnte sie jedoch über die Zeit immer weiter beheben.

Insgesamt ist das Projekt gut gelaufen, ich konnte einiges Lernen und werde vermutlich NestJS in Zukunft erneut verwenden da ich mir vorstellen kann das Angular und NestJS zusammen mit typescript eine gute Projektstruktur aufbauen.

### Zusätzlich

- Man kann über das .env File bestimmte Logs nun ausblenden lassen, das Format bleibt dabei immer gleich (error,warn,log)
