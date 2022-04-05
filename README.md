# 🗒️ Affiliation Manager
Manager for affiliation marketing platforms.

<!-- ABOUT -->
## :page_with_curl:	About the project
Private project, requested by an e-commerce affiliate marketer, with their authorization to publish the source code.

The system is structured with a REST API in Node.js with a layered architecture of responsibility.
Using MySQL to store data consumed through APIs of affiliation platforms.
A simple html/javascript frontend, which consumes the Bootstrap library and the Bootstrap Table table generator with a minimalist style.
All aiming at good usability, ensuring efficiency and simplicity for hosting on low-cost shared servers.

### :construction:	Built with
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Javascript](https://developer.mozilla.org/en/JavaScript)
* [Bootstrap](https://getbootstrap.com)
* [Bootstrap Table](https://bootstrap-table.com/)
* [MySQL](https://www.mysql.com/)
* [Node.js](https://nodejs.org/)
#### Node libraries
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [Express](https://www.npmjs.com/package/express)
* [Cors](https://www.npmjs.com/package/cors)
* [Node Fetch](https://www.npmjs.com/package/node-fetch)
* [Node MySQL 2](https://www.npmjs.com/package/mysql2)
* [Node Cron](https://www.npmjs.com/package/node-cron)


<!-- USAGE -->
## :desktop_computer:	Basic usage
These are basic usage information.
* The user opens url and is asked about a password. No user needed, it's a private single-user system for now.
* Password is saved in browser's session storage and will be used every time a request is sent by javascript code.
* A basic data list is sent with data from last server update. At same time, a server update is fired, so the user can read data while recent is coming.
* Every day at 0h a task runs to update data from affiliation platforms, using their APIs. Data are populated/updated into own MySQL database.
* User can work with data from own database, with many filters and ordering options.

<!-- NOTES FOR DEVELOPERS -->
## :keyboard:	Notes for developers
#### :man_technologist:	Node
The backend is served by Node version 16, structured in layers, currently serving only GET requests using Express library. The daily scheduled task to update the database is done using the node-cron package in order to avoid the need for external scheduling via O.S.
#### :man_technologist:	Bootstrap
The direct use is minimal, just because the page is mainly dinamically filled by Bootstrap Table with their own style options.
#### :iphone: Responsiveness
It's intended to be used exclusively as a datasheet with a desktop computer, no mobile compatible. Just tolerant of some resizing.
#### :earth_americas:	Language
User interface is all in Brazilian Portuguese. On the other hand, all code is in English.
#### 🔒:	Sensitive data
All sensitive data is stored in server only, mainly as environment variables, including API key for all requests.

<!-- FINAL CONSIDERATIONS -->
## Final considerations
This project is under development as of April/2022, with initial release working with 1 platform data. Other platforms are being included.
