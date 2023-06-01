import express from 'express';
import imageRoutes from '../app/routes/imageRoutes';

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/api', imageRoutes);

export default app;
