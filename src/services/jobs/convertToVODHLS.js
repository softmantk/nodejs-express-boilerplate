const fs = require('fs');
const { spawn } = require('child_process');
const Queue = require('bull');
const pathLib = require('path');

const mimeType = require('mime-types');
// const models = require("../models");
const { redis } = require('../../config');
const { projectRootDirectory } = require('../../config');

const VODQueue = new Queue('VOD HSL', {redis});

const convertTOVOD = (inputFilePath, OutputDirectory) => {
    return new Promise((resolve, reject) => {
        const createHLSVOD = spawn('bash', [pathLib.join('src/scripts/vod-hsl-create.sh'), inputFilePath, OutputDirectory]);
        createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
        createHLSVOD.on('error', d => {
            console.log(`error: ${d}`);
            reject(d);
        });
        createHLSVOD.on('close', code => {
            console.log(`child process ended with code ${code}`);
            if (!code) {
                resolve();
            } else {
                reject();
            }
        });
    });

};

VODQueue.process(async (job) => {
    console.log('A Job received', job.data);
    const {
        fileDirectory,
        fileName,
        outPutDirectory,
    } = job.data;

    const filePath = pathLib.join(fileDirectory, fileName);
    try {
        await convertTOVOD(filePath, outPutDirectory);
        return true;
    } catch (e) {
        return e;
    }
});
module.exports.VODQueue = VODQueue;
