const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "eval",
    aliases: ["ㄷㅍ미"],
    category: "owner",
    run: async (client, message, args, ops) => {
        if (!args.join(" ")) return

        let input = `const Discord = require("discord.js")\nconst axios = require("axios")\nconst cheerio = require("cheerio")\nconst fetch = require("node-fetch")\nconst fs = require("fs");\n${args.join(" ")}`

        let type
        new Promise(resolve => resolve(eval(input))).then(res => {
            let output = type = res

            if (typeof output !== "string") output = require("util").inspect(output, { depth: 0 })
            if (typeof type === "function") output = type.toString()
            if (output.includes(client.token)) output = output.replace(new RegExp(client.token, "gi"), "Secret")

            if (output.length > 1500) output = `${output.substr(0, 1495)}...`
            if (!output) output = "결과 없음"

            message.channel.send(new MessageEmbed().setTitle("Eval").setColor(0x00ff00).setDescription(`**📥 Input: **\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n**📤 Output: **\n\`\`\`js\n${output}\n\`\`\``)).then(a => {
                a.react('🗑️')

                a.awaitReactions((reaction, user) => (reaction.emoji.name === '🗑️') && user.id === ops.ownerID, {
                    max: 1
                }).then(collected => collected.array()[0].emoji.name === '🗑️' && a.delete())
            })
        }).catch(e => message.channel.send(new MessageEmbed().setTitle("Eval").setColor(0xff0000).setDescription(`**📥 Input: **\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n**📤 Output: **\n\`\`\`js\n${e}\n\`\`\``)).then(a => {
            a.react('🗑️')

            a.awaitReactions((reaction, user) => (reaction.emoji.name === '🗑️') && user.id === ops.ownerID, {
                max: 1
            }).then(collected => collected.array()[0].emoji.name === '🗑️' && a.delete())
        }))
    }
}