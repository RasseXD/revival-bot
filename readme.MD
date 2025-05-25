# Revival Bot

A simple Node.js script to automate discord revivals for Hypixel Housing events

This project uses the [`discord.js-selfbot-v13`](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) library, which is licensed under the GNU General Public License v3.0

---

## Installation

1. [Install Node.js](https://nodejs.org/en)
2. Download the latest release `.zip` and extract it, or clone the repository

## Configuration

Create a `config.json` file with the following format:

```
{
    "channels": [
        "channel id",
        "another channel id"
    ],
    "bots": [
        {
            "id": "account token",
            "cooldown": 0
        },
        {
            "id": "another account token",
            "cooldown": 0
        }
    ]
}
```

## Usage

1. Open a terminal in the directory
2. Run `npm install` to install dependencies
3. Run the script using `npm start`

-   Every bot you input will react to every channel
-   Cooldown represents how long the bot takes to react in ms
-   You can input as many channels and bots as you want, as long as there's at least one of each
-   You only need to do `npm install` on the first time

## License

This project is licensed under the GNU General Public License v3.0
