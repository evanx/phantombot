module.exports = {
    redisUrl: {
        default: 'redis://localhost:6379'
    },
    namespace: {
        default: 'phantombot'
    },
    bot: {
        example: 'ExPhantomBot',
        description: 'Telegram Bot name',
        info: 'https://core.telegram.org/bots/api',
        hint: 'https://telegram.me/BotFather'
    },
    secret: {
        description: 'Telegram Bot secret',
        example: 'z7WnDUfuhtDCBjX54Ks5vB4SAdGmdzwRVlGQjWBt',
        info: 'https://core.telegram.org/bots/api#setwebhook',
        hint: 'https://github.com/evanx/random-base56'
    },
    token: {
        description: 'Telegram Bot token',
        example: '243751977:AAH-WYXgsiZ8XqbzcqME7v6mUALxjktvrQc',
        info: 'https://core.telegram.org/bots/api#authorizing-your-bot',
        hint: 'https://telegram.me/BotFather'
    },
    admin: {
        example: 'evanxsummers',
        description: 'Authoritative Telegram user',
        info: 'https://telegram.org'
    },
    hubNamespace: {
        description: 'Channel for bot messages via Redis',
        example: 'telebot',
        info: 'https://github.com/evanx/webhook-publish'
    }
};
