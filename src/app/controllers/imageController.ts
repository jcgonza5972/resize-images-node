import { Request, Response } from 'express';
import Image, { ImageDocument, ImageVariant } from '../models/imageModel';
import Task, { ITask } from '../models/taskModel';
import crypto from 'crypto';
import sharp from 'sharp';
import AWS from 'aws-sdk';

export async function saveImage(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      console.log('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { originalname, mimetype, path } = file;

    console.log('Calculating MD5...');
    const md5 = await calculateMD5(path);

    console.log('Getting image resolution...');
    const resolution = await getImageResolution(path);

    const imageVariant: ImageVariant = {
      originalname,
      mimetype,
      path,
      createdAt: new Date(),
      md5,
      width: resolution.width,
      height: resolution.height,
    };

    const image: ImageDocument = new Image({
      original: imageVariant,
      resolutions: [],
    });

    console.log('Saving image...');
    await image.save();

    console.debug('Image saved successfully');

    // Crear tarea asociada a la imagen
    const task: ITask = new Task({
      createdAt: new Date(),
      updatedAt: new Date(),
      resourcePath: path,
      status: 'OPEN',
      imageId: image._id, // Asignar el ID de la imagen a la tarea
    });

    console.log('Saving task...');
    await task.save();

    console.debug('Task saved successfully');

    // Enviar mensaje a la cola SQS
    const message = JSON.stringify({ imageId: image._id, resourcePath: path });
    await sendSQSMessage(message);

    res.status(201).json({ message: 'Image saved successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function calculateMD5(path: string): Promise<string> {
  try {
    const data = await sharp(path).toBuffer();
    const md5 = crypto.createHash('md5').update(data).digest('hex');
    console.log('MD5 calculated successfully');
    return md5;
  } catch (error) {
    console.log('Error calculating MD5:', error);
    throw error;
  }
}

async function getImageResolution(path: string): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(path).metadata();
    const resolution = { width: metadata.width || 0, height: metadata.height || 0 };
    console.log('Image resolution retrieved successfully');
    return resolution;
  } catch (error) {
    console.log('Error getting image resolution:', error);
    throw error;
  }
}

async function sendSQSMessage(message: string): Promise<void> {
  try {

    // Load your AWS credentials and try to instantiate the object.
    AWS.config.loadFromPath('./src/config.json');

    const sqs = new AWS.SQS({ region: 'us-east-1' });
    const params = {
      MessageBody: message,
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/181972791638/TaskQueue',
    };

    await sqs.sendMessage(params).promise();
    console.log('Mensaje enviado correctamente');
  } catch (error) {
    console.log('Error al enviar el mensaje:', error);
    throw error;
  }
}
