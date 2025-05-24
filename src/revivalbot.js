import { Client, Permissions } from "discord.js-selfbot-v13";
import { readFile } from "fs/promises";
import emojiRegex from "emoji-regex";

const SAY_REGEX = /say (.*?) in/;
const QUOTE_REGEX = /"([^"]*)"/g;

export class RevivalBot {
    static emojiRegexInstance = emojiRegex();

    constructor(token, cooldown) {
        this.client = new Client();
        this.cooldown = cooldown;

        this.registerListeners();
        this.client.login(token);
    }

    static async getConfig() {
        const jsonText = await readFile("./config.json", "utf-8");
        return JSON.parse(jsonText);
    }

    registerListeners() {
        this.client.on("ready", async () => {
            console.log(`${this.client.user.username} is ready!`);
        });

        this.client.on("messageCreate", async (message) => {
            if (message.author.id === this.client.user.id) return;

            let config = await RevivalBot.getConfig();
            if (!config.channels.includes(message.channelId)) return;

            let userMentions = message.mentions.users;
            let channelMentions = message.mentions.channels;

            if (channelMentions.size <= 0) return;

            let sayMatches = message.content.match(SAY_REGEX);
            let quoteMatches = message.content.match(QUOTE_REGEX);
            let emojiMatches = message.content.matchAll(
                RevivalBot.emojiRegexInstance
            );

            if (sayMatches) {
                this.sendMessage(
                    channelMentions.first(),
                    sayMatches[1],
                    this.cooldown
                );
                return;
            }

            //handle rest of stuff in way that supports multiple of them happening
            //ping, quote, emoji

            console.log(message.content);
        });
    }

    sendMessage(channel, message, cooldown = 0) {
        if (
            !channel
                .permissionsFor(channel.guild.members.me)
                .has(Permissions.FLAGS.SEND_MESSAGES)
        )
            return;

        setTimeout(() => {
            channel.send(message);
        }, cooldown);
    }
}
