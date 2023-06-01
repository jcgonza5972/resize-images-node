import request from 'supertest';
import app from '../../config/express';


describe('Image Routes', () => {
  test('should save the image successfully', async () => {
    const response = await request(app)
      .post('/api/images')
      .attach('image', 'path/to/image.jpg')
      .expect(201);

    expect(response.body).toEqual({ message: 'Image saved successfully' });
  });
});
