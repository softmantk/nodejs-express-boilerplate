const router = require('express')
    .Router();
const controller = require('../../controllers/stream');
const upload = require('../../middlewares/upload');

const singleVideo = upload.uploadHandler({
    filename: 'video',
    type: 'single',
    ext: ['.mp4', '.webm', '.avi'],
    fileSize: 500 * 1024 * 1024, // upto 50mb
});

router.route('/')
    .post(singleVideo, controller.uploadStream);
router.route('/:id')
    .get(controller.getStreamInfoById);
router.route('/:id/view')
    .get(controller.getStreamById);

module.exports = router;
