# InfoVis-Group4 - Project „Hamsterkäufe unter der Lupe“
## Open the Application
To access the application, open https://danielle-schuman.github.io/InfoVis-Hamsterkaeufe-unter-der-Lupe/ in Firefox or Chrome.
Be aware that on small screens, you might need to zoom out a couple of times, by entering STRG+- and then reloading the page, to get an optimal page layout.

## Browser compatibility
Our application supports Chrome (Version 88.0.4324.96 and newer) and Firefox (Version 85.0 and newer).
It also runs reasonably well on Safari (Version 14.0.2 and newer).
We do not support Microsoft Edge, Internet Explorer, Opera, older Versions of Firefox, mobile browsers or any other browsers not mentioned in this section.

## Start the Application locally
Alternatively, you can run the application on your local computer after downloading the source code from this repository.
Before starting it, you need to install the following npm package:
```batch
npm install --global http-server
```

or you can run this function using npx without installing it first:
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

# Glossary
## Features of our Application
- [x] Base Structure of the Project
- [x] Connected Scatterplot
  - [x] Shows progress for each bubble
  - [x] Shows flag on each bubble representing the countries
  - [x] Can hide/show progress lines for all countries when triggered by a toggle
  - [x] Contains real data, interpolated values are marked by color
  - [x] Has Zoom-Functionality which can be triggered by a button
  - [x] Has tooltip showing numbers on hover
- [x] Spider Chart
  - [x] Shows progress for each country
  - [x] Can hide/show data for specific countries triggered by filter checkboxes
  - [x] Contains real data
  - [x] Is only shown when the checkbox of at least one country is checked
  - [x] Can show data of several countries at once
  - [ ] ~~Shows incidence as a number next to the chart~~
  - [ ] ~~Shows incidence as color brightness~~
- [x] Slider
  - [x] Integrated implementation
  - [x] Manipulates the scatter chart
  - [x] Manipulates the spider chart
  - [x] Supports a playback function which can be triggered by a play-button
- [x] Filter ~~Toggle~~ Undo-Button
  - [x] Turns ~~on/~~ off the effect of all filter checkboxes
  - [x] Is turned on automatically when a checkbox is checked or turned off when the last checkbox is unchecked
- [x] Legend showing which color represents which country

## Further Information
A Dokumentation of how we planned and executed our project can be found in the folder "Projektplanung", inside a PDF-file called "InfoVis_Doku.pdf".
