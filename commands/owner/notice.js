const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "notice",
    aliases: ["공지", "공지사항", "ㅜㅐ샻ㄷ", "rhdwl", "rhdwltkgkd"],
    category: "owner",
    run: async (client, message, args) => {
        if (!args.join(" ")) return message.channel.send("내용을 써 주세요!")

        message.channel.send(new MessageEmbed().setTitle(`${client.user.username} 공지사항`).setDescription(`\`\`\`\n${args.join(" ")}\n\`\`\``).setColor("RANDOM")).then(async th => {
            await th.react("⭕")
            await th.react("❌")
            
            th.awaitReactions((reaction, user) => (reaction.emoji.name === "❌" || reaction.emoji.name === "⭕") && user.id === message.author.id, {
                max: 1,
                time: 20000
            }).then(collected => {
                if (collected.array()[0].emoji.name === "⭕") {
                    let result = ''

                    client.guilds.cache.forEach(g => {
                        let gc

                        g.channels.cache.forEach(c => {
                            if (c.name.includes(client.user.username) || c.name.includes("봇공지") || c.name.includes("봇-공지") || c.name.includes("봇_공지")) gc = c.id
                        })

                        const Ch = client.channels.cache.get(gc)
                        let ment = ''

                        try {
                            if (!Ch.permissionsFor(g.me).has("SEND_MESSAGES")) ment = `${g.name}: 발신 실패 (메시지 발신 불가)\n`
                            else if (!Ch.permissionsFor(g.me).has("EMBED_LINKS")) {
                                Ch.send(`**${client.user.username} 공지사항**\n\n${args.join(" ")}\n(${message.author.tag})`)
                                ment = `${g.name}: 임베드 발신 실패 (발신 완료)\n`
                            }
                            else Ch.send(new MessageEmbed().setTitle(`${client.user.username} 공지사항`).setThumbnail(client.user.displayAvatarURL()).setDescription(args.join(" ")).setColor(0x00ff00).setFooter(message.author.tag, message.author.displayAvatarURL()).setTimestamp())
                        } catch (e) {
                            if (!Ch) ment = `${g.name}: 발신 실패 (채널이 없음)\n`
                            else ment = `${g.name}: 발신 실패 (오류: ${e})\n`
                        } finally {
                            if (ment) result += ment
                        }
                    })
            
                    th.edit(new MessageEmbed().setTitle("공지사항 발신 완료").setDescription(`**결과**\n\`\`\`\n${result || "모든 서버에 발신 완료"}\n\`\`\``).setColor(0x00ff00))
                } else {
                    th.edit(new MessageEmbed().setTitle("공지사항 발신 취소").setColor(0x00ff00))
                }
            })
        })
    }
}