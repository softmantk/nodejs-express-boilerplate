const fs = require('fs');
const Queue = require('bull');
const ffmpeg = require('fluent-ffmpeg');
const pathLib = require('path');
// const models = require("../models");
const { redis } = require('../../config');


const videoQueue = new Queue('video transcoding', { redis });

const convertVideo = ({
    path, size, outPutPath,
}) => {
    return new Promise((resolve, reject) => {
        ffmpeg(path)
            .size(size)
            .on('start', (commandLine) => {
                console.log(`Spawned Ffmpeg with command: ${commandLine}`);
            })
            .on('error', (err, stdout, stderr) => {
                console.log(err, stdout, stderr);
                reject(err);
            })
            .on('end', (stdout, stderr) => {
                // console.log(stdout, stderr);
                resolve();
            })
            .saveToFile(outPutPath);
    });
};
videoQueue.process(async (job) => {
    console.log('A Job received', job.data);
    const {
        fileDirectory,
        fileName,
        outputQualities,
        outPutDirectory,
    } = job.data;
    try {
        const tasksAttributes = outputQualities.map(quality => {
            const newFileName = addQualityInFileName(fileName, quality);
            return {
                newFileName,
                path: pathLib.join(fileDirectory, fileName),
                outPutPath: pathLib.join(outPutDirectory, newFileName),
                size: getSizeFromQuality(quality),
            };
        });
        console.log('48::tasksAttributes:', tasksAttributes);
        const convertTasks = await Promise.all(tasksAttributes.map(t => convertVideo(t)));
        // const pathObj = await convertVideo({
        //     path: fileFullPath,
        //     size,
        //     outPutPath,
        // });
        // return pathObj;
        return convertTasks;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
});

function addQualityInFileName(name, quality) {
    const chunks = name.split('.');
    chunks.splice(chunks.length - 1, 0, `_${quality}.`);
    return chunks.join('');
}

function getSizeFromQuality(quality) {
    let size;
    switch (quality) {
    case '720':
        size = '1280x720';
        break;
    case '1080':
        size = '1920x1080';
        break;
    case '480':
        size = '640x480';
        break;
    case '240':
        size = '320x240';
        break;
    default:
        throw new Error('quality param doesnt match existing options');
    }
    return size;
}

module.exports.videoQueue = videoQueue;
