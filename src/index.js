
const assert = require('assert');
const fetch = require('node-fetch');
const lodash = require('lodash');
const Promise = require('bluebird');
const formatElapsed = require('../components/formatElapsed');
const formatTime = require('../components/formatTime');

main();

async function main() {
    Object.assign(global, await require('../components/redisApp')(require('./meta')));

    const state = {};
    config.botUrl = `https://api.telegram.org/bot${config.token}`;
    logger.level = config.loggerLevel;
    try {
        if (config.hubNamespace) {
            await subscribeHub(config);
        }
    } catch (err) {
        console.error(err);
    } finally {
    }
}

async function subscribeHub({hubNamespace, hubRedis, secret}) {
    state.clientHub = redis.createClient(hubRedis);
    state.clientHub.on('message', (channel, message) => {
        if (channel.endsWith(secret)) {
            logger.debug({channel, message});
            handleTelegramMessage(JSON.parse(message));
        } else {
            logger.warn('subscribeHub', {channel});
        }
    });
    state.clientHub.subscribe([hubNamespace, secret].join(':'));
}

async function subscribeEnd({endChannel, endMessage}) {
    state.clientEnd = redis.createClient(config.redisUrl);
    state.clientEnd.on('message', (channel, message) => {
        if (channel === endChannel) {
            if (message === endMessage) {
                end();
            }
        }
    });
    state.clientEnd.subscribe(endChannel);
}

async function handleTelegramMessage(message) {
    const from = message.message.from;
    const request = {
        chatId: message.message.chat.id,
        username: from.username,
        name: from.first_name || from.username,
        text: message.message.text,
        timestamp: message.message.date
    };
    logger.debug('webhook', request, message.message);
    if (request.text === '/text') {
        return handleTelegramText(request);
    } else if (request.text === '/textall') {
        return handleTelegramTextAll(request);
    } else {
        await sendTelegram(request.chatId, 'html', [
            `Try /text.`,
            `Powered by github.com/evanx/phantombot by @evanxsummers.`
        ]);
    }
}

async function handleTelegramText(request) {
    const {username, name, chatId} = request;
    await sendTelegramReply(request, 'html', [
        `Apologies, not yet implemented.`,
    ]);
}

async function handleTelegramTextAll(request) {
    const {username, name, chatId} = request;
    await sendTelegramReply(request, 'html', [
        `Apologies, not yet implemented.`,
    ]);
}

async function sendTelegramReply(request, format, ...content) {
    if (request.chatId && request.name) {
        await sendTelegram(request.chatId, format,
            `Thanks, ${request.name}.`,
            ...content
        );
    } else {
        logger.error('sendTelegramReply', request);
    }
}

async function sendTelegram(chatId, format, ...content) {
    logger.debug('sendTelegram', chatId, format, content);
    try {
        const text = lodash.trim(lodash.flatten(content).join(' '));
        assert(chatId, 'chatId');
        let uri = `sendMessage?chat_id=${chatId}`;
        uri += '&disable_notification=true';
        if (format === 'markdown') {
            uri += `&parse_mode=Markdown`;
        } else if (format === 'html') {
            uri += `&parse_mode=HTML`;
        }
        uri += `&text=${encodeURIComponent(text)}`;
        const url = [state.botUrl, uri].join('/');
        const options = {timeout: config.sendTimeout};
        logger.info('sendTelegram url', url, {options});
        const res = await fetch(url, options);
        if (res.status !== 200) {
            logger.warn('sendTelegram status', res.status, {chatId, url});
        }
    } catch (err) {
        logger.error(err);
    }
}

async function end() {
    client.quit();
    if (state.clientHub) {
        state.clientHub.quit();
    }
    if (state.clientEnd) {
        state.clientEnd.quit();
    }
}
