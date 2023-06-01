import crypto from 'crypto';
const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { imageId, path } = JSON.parse(event.Records[0].body);

        // Obtener el objeto de la imagen original desde Amazon S3
        const originalImage = await s3.getObject({ Bucket: 'your-bucket-name', Key: path }).promise();

        // Generar variantes de 1024 y 800 px de ancho
        const resized1024 = await sharp(originalImage.Body).resize(1024).toBuffer();
        const resized800 = await sharp(originalImage.Body).resize(800).toBuffer();

        const imageIdFolder = imageId.replace('.jpg', '');

        // Guardar las variantes en la carpeta /output
        await saveImageToS3(resized1024, `${imageIdFolder}/1024/${generateFilename(resized1024)}`);
        await saveImageToS3(resized800, `${imageIdFolder}/800/${generateFilename(resized800)}`);

        return { statusCode: 200, body: 'Images generated successfully' };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, body: 'An error occurred' };
    }
};

async function saveImageToS3(imageBuffer, key) {
    await s3.putObject({ Bucket: 'your-bucket-name', Key: key, Body: imageBuffer }).promise();
}

function generateFilename(imageBuffer) {
    const md5 = crypto.createHash('md5').update(imageBuffer).digest('hex');
    return `${md5}.jpg`;
}
