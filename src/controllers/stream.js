const fs = require('fs');

const Stream = require('../services/db/models/stream');

exports.getStreamInfoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('6:getStreamById:id:', id);

        const stream = await Stream.findById(id);
        console.log('9:getStreamById:stream:', stream);
        if (!stream) {
            return res.status(404)
                .json({ message: 'Not found' });
        }
        return res.json({
            stream,
            message: 'connected',
        });
    } catch (e) {
        return next(e);
    }
};
exports.getStreamById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stream = await Stream.findById(id);
        if (!stream) {
            return res.status(404)
                .json({ message: 'Not found' });
        }
        const { path } = stream.metaInfo;
        // console.log('36:getStreamById:path:', path);
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const { range } = req.headers;
        console.log('37:getStreamById:range:', range);

        if (!range) {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            return fs.createReadStream(path)
                .pipe(res);
        }

        const parts = range.replace(/bytes=/, '')
            .split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, {
            start,
            end,
        });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        return file.pipe(res);
    } catch (e) {
        return next(e);
    }
};
exports.uploadStream = async (req, res, next) => {
    try {
        const videoDetails = req.file;
        const stream = await Stream.create({
            metaInfo: videoDetails,
        });
        return res.json({ stream });
    } catch (e) {
        return next(e);
    }
};