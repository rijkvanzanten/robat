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

## Overview
Robat is a chatbot which can help you with ~all~ ~most~ some of your questions regarding  [Amsterdam Public Library (OBA)](http://oba.nl).

The chatbot only speaks Dutch at the moment.

Some questions you can ask/tell Robat:  
- [x] Kan ik overstappen op een ander abonnement?
- [x] Hoe kan ik materiaal verlengen?
- [x] Wat is het nieuwste boek van Nikki French?
- [x] Ik ben mijn pas kwijt
- [x] Welke lidmaatschappen heeft de OBA?
- [ ] Tot hoelaat is de Centrale OBA morgen open?
- [ ] Wat kost een OBA Totaal abonnement?

## Tech Stack
- HTML, CSS & JS
- [Node.JS](http://nodejs.org) w/
  - [Express](https://expressjs.com) webserver
  - [Socket.io](http://socket.io) websocket connection
- [Wit.ai](http://wit.ai) Natural Language Processor

## Installation
Clone this repo
```bash
$ https://github.com/rijkvanzanten/robat.git
```

and run `npm install` to install all dependencies.

After the installation, the application should automagically build the client-side assets. If this for some reason failed run `npm run build`.

You will need a `.env` file in the root of your project which contains a (server) Wit AI key and a public/secret keypair for the OBA API:
```
WIT_KEY=1234567890
OBA_PUBLIC=1234567890
OBA_SECRET=1234567890
```

## Usage
To start the app, run `npm start`.

To run the app in development mode (with auto rebuilding), run `npm run dev`.

To test your code for linting errors, run `npm test`.

## Wishlist
- [ ] Add send/read indicators (like WhatsApp)
- [ ] Add Robat user icon next to messages
- [ ] Show dates send/received
- [ ] Add "Last online at" in title bar
- [ ] Support whole [OBA FAQ](https://www.oba.nl/oba/english/frequently-asked-questions.html) in conversation
- [ ] Multilingual support

## Contributing
PRs are — as always — very welcome.

### Writing commit messages
_Based on [**Chris Beams**](https://chris.beams.io/posts/git-commit/) seven Rules of a great Git commit message._

1. Separate subject from body with a blank line.
1. Limit the subject line to 50 characters.
1. Do not end the subject line with a period.
1. Use the imperative mood in the subject line.
1. Wrap the body at 72 characters.
1. Use the body to explain what and why vs. how.

**Example commit title:**
```
💄 Add styling for navigation bar
```
[Gitmoji](https://gitmoji.carloscuesta.me/) is used for commit messages

## Core Team
![Rijk van Zanten](https://avatars0.githubusercontent.com/u/9141017?v=3&s=460) | ![Giulia Meerman](https://avatars0.githubusercontent.com/u/14131081?v=3&s=460) | ![Danny de Vries](https://avatars1.githubusercontent.com/u/22084444?v=3&s=460) | ![Mirza van Meerwijk](https://avatars2.githubusercontent.com/u/12242967?v=3&s=460) | ![Pierre Bleeker](https://avatars0.githubusercontent.com/u/12711649?v=3&s=460)
---|---|---|---|---
[Rijk van Zanten](https://github.com/rijkvanzanten) | [Giulia Meerman](https://github.com/GiuliaM) | [Danny de Vries](https://github.com/dandevri) | [Mirza van Meerwijk](https://github.com/Mimaaa) | [Pierre Bleeker](https://github.com/pierman1)

## License

MIT

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
