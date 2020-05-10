const Arena = require('bull-arena');
const { redis } = require('../../config');

const arena = Arena({
    queues: [
        {
            ...redis,
            name: 'VOD_HSL',
            hostId: 'VOD HSL Server',
        },
    ],
}, { disableListen: true });
module.exports = arena;
