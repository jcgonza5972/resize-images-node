import { saveImage } from '../../app/controllers/imageController';
import Image from '../../app/models/imageModel';

jest.mock('../../app/models/imageModel');

describe('Image Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save the image successfully', async () => {
    const req: any = {
      file: {
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        path: '/path/to/image.jpg',
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await saveImage(req, res);

    expect(Image.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image saved successfully' });
  });

  test('should handle error when saving image', async () => {
    const req: any = {
      file: {
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        path: '/path/to/image.jpg',
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = 'An error occurred';

    Image.prototype.save.mockRejectedValueOnce(new Error(errorMessage));

    await saveImage(req, res);

    expect(Image.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
