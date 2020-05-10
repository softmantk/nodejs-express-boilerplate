const ffmpeg = require('fluent-ffmpeg');

/*
this can be done. but later. Refer hsl vod script (vod-hsl-create.sh)
and convert that into fluent ffmpeg code.
*/
// https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/819
const filePath = '/Users/nikhilcm/nikhil/projects/streaming-nodejs/stream_files/uploads/eac68647-1354-4e45-a286-0692eea335dc.webm';

ffmpeg(filePath)
    // .audioCodec('libopus')
    .audioBitrate(96)
    .outputOptions([
        '-hls_time 20',
        '-hls_playlist_type vod',
        '-hls_segment_filename /Users/nikhilcm/nikhil/projects/streaming-nodejs/stream_files/uploads/out/%03d.ts',
        '-hls_base_url http://localhost:8080/',
    ])
    .output('/Users/nikhilcm/nikhil/projects/streaming-nodejs/stream_files/uploads/outtp.m3u8')

    .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
    })
    .on('end', (err, stdout, stderr) => {
        console.log('Finished processing!');
        // console.log(stdout)
    })
    .on('error', (e) => console.log(e))
    .run();
