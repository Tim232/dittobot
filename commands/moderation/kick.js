const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "kick",
    aliases: ["추방", "cnqkd", "킥", "ㅏㅑ차"],
    usage: "{prefix}추방 <멘션|ID> [이유]",
    category: "moderation",
    run: async (client, message, args, ops) => {
        if (!args[0]) return message.reply('추방할 멤버를 멘션 또는 ID로 적어주세요.')

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("❌ 추방 권한이 필요합니다.")
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(`❌ ${client.user.username}의 권한에 **추방 권한**이 필요합니다.`)

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send('멤버를 찾을 수 없습니다.')

        if (message.author.id === user.id) return message.channel.send('자기 자신을 추방할 수 없습니다.')

        if (!user.kickable) return message.channel.send(`역할이 ${client.user.username} 보다 높거나 권한이 부족하여 추방을 할 수 없습니다.`)

        const embed = new MessageEmbed().setColor(0xff0000)
            .setThumbnail(user.user.displayAvatarURL())
            .setFooter(message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
            .setTitle('멤버 추방')
            .setDescription(`**추방된 멤버**\n${user}\n\n**추방한 사람**\n${message.author}\n\n**이유**\n${args.slice(1).join(" ") || "없음"}`)

        const promtEmbed = new MessageEmbed().setColor(0x00ff00).setDescription(`**${user}(${user.id})**님을 추방하실 건가요?`)

        message.channel.send(promtEmbed).then(async (msg) => {
            await msg.react('✅')
            await msg.react('❎')

            msg.awaitReactions((reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && user.id === message.author.id, {
                max: 1
            }).then((collected) => {
                if (collected.array()[0].emoji.name === '✅') {
                    msg.delete()

                    user.kick(args.slice(1).join(" ") || null).catch(err => message.channel.send(`알 수 없는 오류가 발생했습니다.\n${err}`))
    
                    message.channel.send(embed)
                } else {
                    msg.delete()

                    message.channel.send('추방이 취소되었습니다.')
                }
            })
        })
    }
}