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

            if (sayMatches) {
                this.sendMessage(
                    channelMentions.first(),
                    sayMatches[1],
                    this.cooldown
                );
                return;
            }

            let quoteRanges = getQuoteRanges(message.content);
            let quotes = quoteRanges.map((q) => q.text);
            let emojis = extractEmojis(message.content, quoteRanges);
            let mentions = extractMentions(
                message.content,
                userMentions,
                quoteRanges
            );

            let outputMessage = [...quotes, ...emojis, ...mentions]
                .join(" ")
                .trim();

            this.sendMessage(
                channelMentions.first(),
                outputMessage,
                this.cooldown
            );

            console.log(message.content);
        });
    }

    sendMessage(channel, message, cooldown = 0) {
        if (
            !channel
                .permissionsFor(channel.guild.members.me)
                .has(Permissions.FLAGS.SEND_MESSAGES) ||
            message.trim() == ""
        )
            return;

        setTimeout(() => {
            channel.send(message);
        }, cooldown);
    }
}

function getQuoteRanges(content) {
    const ranges = [];
    let match;
    while ((match = QUOTE_REGEX.exec(content)) !== null) {
        ranges.push({
            text: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }
    return ranges;
}

function isInsideRange(index, ranges) {
    return ranges.some(({ start, end }) => index >= start && index < end);
}

function extractEmojis(content, quoteRanges) {
    const emojis = [];
    for (const match of content.matchAll(RevivalBot.emojiRegexInstance)) {
        if (!isInsideRange(match.index, quoteRanges)) {
            emojis.push(match[0]);
        }
    }
    return emojis;
}

function extractMentions(content, users, quoteRanges) {
    const mentions = [];
    for (const user of users.values()) {
        const mentionStr = `<@${user.id}>`;
        const index = content.indexOf(mentionStr);
        if (index !== -1 && !isInsideRange(index, quoteRanges)) {
            mentions.push(mentionStr);
        }
    }
    return mentions;
}
