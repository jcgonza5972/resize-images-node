import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    createdAt: Date;
    updatedAt: Date;
    resourcePath: string;
    status: string;
    imageId: mongoose.Types.ObjectId; // Referencia al ID del documento de Image
}

const TaskSchema: Schema = new Schema({
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    resourcePath: { type: String, required: true },
    status: { type: String, required: true, default: 'OPEN' },
    imageId: { type: mongoose.Types.ObjectId, ref: 'Image' }, // Campo de referencia al ID de Image
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
