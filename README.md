# MapMyWiki

Map My Wiki is geo-wiki type application created for <a href="www.lighthouselabs.ca">LightHouseLabs.ca</a> mid-term project to exercise our skills to date in the course including front and back end scripting in Javascript, Postgress SQL, HTML and CSS.

MapMyWiki is a joint effort between
- Ernie Johnson
- Atsuyuki

![](./screenshots/mockup.jpg)

---
## Contents...
1. [Features](#features)
2. [Future Plans](#future-plans)
3. [Quick Start](#quick-start)
4. [Detailed Operation](#detailed-operation)
5. [Known Bugs](#known-bugs)
6. [Attributions](#attributions)
7. [Updates](#updates)
---
## Features...
![](./screenshots/overview-ani.gif)
-
[( back to top 🔺)](#lightbnb)

---
## Future Plans...
- allow additional sorting of any displayed results
- allow map owner to style their app with custom backgrounds and icons
- dark mode styling on the map
- style entire project for responsive design: mobile to desktop
[( back to top 🔺)](#lightbnb)

---
## Getting Started
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
  - username: `labber`
  - password: `labber`
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

---
## Detailed Operation...
- dfdfdf
![](./screenshots/screenshot-currency.png)
[( back to top 🔺)](#lightbnb)
---
## Known Bugs...
- Vertical scroll bar is forced 'always' on' to prevent page shifts when data exceeds bottom of viewable space.
- This application has been tested on Windows 11 via WSL, Ubuntu Linux 20.04, and MacOS 16 Ventura. All platforms tested with Chrome and Firefox browsers. Please report any bugs found!
[( back to top 🔺)](#lightbnb)
---
## Attributions...
- [conColors](https://github.com/ej8899/conColors) (misc. functions)
- [conColors](https://github.com/ej8899/conColors) (misc. CSS for dark mode template)
- FontAwesome
- Google Fonts, Google Maps API
- Ajax
- Node.js
- PostgreSQL
- SCSS (CSS)
- ExpressJS
- JQuery
- bcrypt
- cookie-session
- dotenv
- morgan
- eslint
- nodemon
[( back to top 🔺)](#lightbnb)
---
## Updates...
- Get the latest of our version of LightBnB on [Github here](https://github.com/ej8899/lightbnb).
[( back to top 🔺)](#lightbnb)
---
