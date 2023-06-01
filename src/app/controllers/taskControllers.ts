import { Request, Response } from 'express';
import Task, { ITask } from '../models/taskModel';

export async function getTaskById(req: Request, res: Response): Promise<void> {
    try {
        const taskId = req.params.taskId;

        const task: ITask | null = await Task.findById(taskId);

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json({ status: task.status });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
