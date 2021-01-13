# InfoVis-Group4
## Start the Application
Before starting the application, you need to install the following npm package:
```batch
npm install --global http-server
```

or run this function using npx without installing it first:
```batch
npx http-server
```

Start the http server with the following command in the main directory ("InfoVis-Group4") of the application (which contains the index.html)
```batch
http-server
```

The application will then be available here:
```
http://localhost:8080
```
### Or simply open: https://danielle-schuman.github.io/InfoVis-Hamsterkaeufe-unter-der-Lupe/ !

## MVP is currently only 100% correctly working on Google Chrome!
Bugs in Firefox will be fixed soon...

# Glossar
## Previously Planned Features 4 Our MVP
- [x] Base Structure of the Project
- [x] Connected Scatterplot
  - [x] First prototype
  - [x] Shows progress for each bubble
  - [x] Shows flag on each bubble representing the countries
  - [x] Can hide/show progress lines for all countries when triggered by a toggle
  - [x] Contains real data
- [ ] Spider Chart
  - [x] First prototype
  - [ ] Shows progress for each country
  - [x] Can hide/show data for specific countries triggered by filter checkboxes
  - [ ] Contains real data
- [ ] Slider
  - [x] First implementation (not fully integrated in the application)
  - [x] Integrated implementation
  - [x] Manipulates the scatter chart
  - [ ] Manipulates the spider chart
- [ ] Filter Toggle
  - [x] Is turned on automatically when a checkbox is checked or turned off when the last checkbox is unchecked

## Optional Features
- [ ] Slider
  - [ ] Supports a playback function which can be triggered by a play-button
- [ ] Filter Toggle
  - [x] Turns on/off the effect of all filter checkboxes
- [x] Connected Scatterplot
  - [x] Flaggen in Länder-Bubbles
  - [x] Toggle für Verlauf ein- & ausblenden bei Länder Plot
- [ ] Spider Chart
  - [x] ein- & ausblendbar 
  - [ ] ~~cool animierter Übergang von Liniendiagramm zu Spider Plot~~
  - [x] Spider Plot von verschiedenen Länder übereinander
  - [ ] Inzidenz anzeigen als Zahl beim Spider Plot
  - [ ] ~~Inzidenz als Farbhelligkeit in Spider Plot~~
- [ ] Other Features
  - [ ] Undo-Button für Filter
  - [ ] Undo-Button
  - [ ] Speicher-Button




## Weiterführende Informationen
- Notizen zu den bisherigen Besprechungen / Meilensteinen: see private Repo
- To-Do's: siehe Gantt-Chart im Ordner Projektplanung sowie Github-Issues in private Repo
