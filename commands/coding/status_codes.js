module.exports = {
    name: 'status_codes',
    aliases: ['상태코드', 'tkdxozhem', 'ㄴㅅㅁ션_챙ㄷㄴ'],
    category: 'coding',
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('확인할 상태 코드를 입력해 주세요')

        const result = require('http').STATUS_CODES[args[0]]

        message.channel.send(result ? `${args[0]} ${result}` : '존재하지 않는 코드입니다')
    }
}