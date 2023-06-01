import mongoose, { Schema, Document } from 'mongoose';

export type ImageVariant = {
  originalname: string;
  mimetype: string;
  path: string;
  createdAt: Date;
  md5: string;
  width: number;
  height: number;
};

export type ImageDocument = Document & {
  original: ImageVariant;
  resolutions: ImageVariant[];
};

const imageVariantSchema: Schema = new mongoose.Schema({
  originalname: String,
  mimetype: String,
  path: String,
  createdAt: { type: Date, default: Date.now },
  md5: String,
  width: Number,
  height: Number,
});

const imageSchema: Schema = new mongoose.Schema({
  original: imageVariantSchema,
  resolutions: [imageVariantSchema],
});

const Image = mongoose.model<ImageDocument>('Image', imageSchema);

export default Image;
