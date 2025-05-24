import { RevivalBot } from "./revivalbot.js";

async function main() {
    let config = await RevivalBot.getConfig();
    for (let bot of config.bots) {
        new RevivalBot(bot.id, bot.cooldown);
    }
}

main();
