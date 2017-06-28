<h1 align="center">
	<img width="200" src="media/robat_icon-logo.png" alt="Logo">
	<br>
</h1>

<p align="center">
	<b>🤖 OBA Chatbot @ <a href="http://robat.rijks.website">robat.rijks.website</a> 🤖</b>
</p>

# Robat
[![Build Status](https://semaphoreci.com/api/v1/rijkvanzanten/robat/branches/master/shields_badge.svg)](https://semaphoreci.com/rijkvanzanten/robat)
![NPM](https://img.shields.io/npm/v/npm.svg)
![Robat](https://img.shields.io/badge/🤖-robat-E30111.svg)


> Robat is a chatbot which can help you with ~all~ ~most~ some of your questions regarding  [Amsterdam Public Library (OBA)](http://oba.nl).

## :book: Introduction
Robat is a web-based chatbot which (from any device) can answer questions about the Amsterdam Public Library.

Some questions you can ask/tell Robat:  
* Het wijzigen, aanvragen en de prijzen van een lidmaatschap.
* Het verlengen van materiaal
* Opvragen locaties van de OBA (inclusief google maps link)
* Openingstijden van OBA locatie
* Contactinformatie van een OBA locatie
* Het kwijtraken van je pas

To view a full in-depth report of this project you can view the [GitBook](https://dandevri.gitbooks.io/oba) of this project.

## ⚙️ Installation & Development

### Tech Stack
- HTML, CSS & JS
- [Node.JS](http://nodejs.org) w/
  - [Express](https://expressjs.com) webserver
  - [Socket.io](http://socket.io) websocket connection
- [Wit.ai](http://wit.ai) Natural Language Processor

### Prerequisites
* Make sure you have [`node`](https://nodejs.org/en/) installed on your machine.

### Installation
1. Clone this repo
```bash
$ https://github.com/rijkvanzanten/robat.git
```

2. Run `npm install` to install all dependencies.

*After the installation, the application should automagically build the client-side assets. If this for some reason failed run `npm run build`.*

You will need a `.env` file in the root of your project which contains a (server) Wit AI key and a public/secret keypair for the OBA API:
```
WIT_KEY=1234567890
OBA_PUBLIC=1234567890
OBA_SECRET=1234567890
```

### Usage
* To start the app, run `npm start`.
* To run the app in development mode (with auto rebuilding), run `npm run dev`.
* To test your code for linting errors, run `npm test`.

## :white_check_mark: Todo's /  :sparkles: Wishlist
To see all upcoming todo's and features please navigate to the [issues](https://github.com/rijkvanzanten/robat/issues) page of this repo.

- [x] Add send/read indicators (like WhatsApp)
- [x] Show dates send/received
- [x] Show online / offline indicator
- [ ] Search for activities within the oba
- [ ] Support whole [OBA FAQ](https://www.oba.nl/oba/english/frequently-asked-questions.html) in conversation
- [ ] Multilingual support

## :page_facing_up: Contributing
Please read [Contributing](CONTRIBUTING.md) for details on how to contribute to this project.
To see a list of everybody who participated go to the [Contributors](https://github.com/rijkvanzanten/robat/graphs/contributors) page.

When you do, please also view the [Code of Conduct](CODE_OF_CONDUCT.md) for this project.

## Core Team
![Rijk van Zanten](https://avatars0.githubusercontent.com/u/9141017?v=3&s=460) | ![Giulia Meerman](https://avatars0.githubusercontent.com/u/14131081?v=3&s=460) | ![Danny de Vries](https://avatars1.githubusercontent.com/u/22084444?v=3&s=460) | ![Mirza van Meerwijk](https://avatars2.githubusercontent.com/u/12242967?v=3&s=460) | ![Pierre Bleeker](https://avatars0.githubusercontent.com/u/12711649?v=3&s=460)
---|---|---|---|---
[Rijk van Zanten](https://github.com/rijkvanzanten) | [Giulia Meerman](https://github.com/GiuliaM) | [Danny de Vries](https://github.com/dandevri) | [Mirza van Meerwijk](https://github.com/Mimaaa) | [Pierre Bleeker](https://github.com/pierman1)

## 📃 License
This project is licensed under the [MIT](LICENSE) License
