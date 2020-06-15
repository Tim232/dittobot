const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'movie',
    aliases: ['영화', 'dudghk', 'ㅡㅐ퍋'],
    category: 'naver',
    run: async (client, message, args) => {
        if (!args.join(' ')) return

        const res = await fetch(`https://openapi.naver.com/v1/search/movie?query=${encodeURI(args.join(" "))}`, {
            method: 'GET',
            headers: {
                "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET
            }
        }).then(e => e.json())

        if (!res.items[0]) return message.channel.send(`${args.join(' ')} (이)라는 영화를 찾을 수 없습니다`)

        const { items: [ { title, subtitle, link, image, pubDate, director, actor, userRating } ] } = res

        message.channel.send(new MessageEmbed().setAuthor('Naver Movie', 'https://www.naver.com/favicon.ico?1', 'https://movie.naver.com/').setTitle('네이버 영화').setURL(link).setThumbnail(image).setColor(0x00ff00).setDescription(`**${title.replace('<b>', '').replace('</b>', '')}**\n${subtitle && `(${subtitle})\n`}\n제작연도: ${pubDate}\n감독: ${director.split('|').slice(0, -1).join(', ') || "알 수 없음"}\n배우: ${actor.split('|').slice(0, -1).join(', ') || "알 수 없음"}\n평점: ${parseFloat(userRating) || "없음"}`))
    }
}