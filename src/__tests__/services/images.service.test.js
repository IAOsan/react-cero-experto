import 'vitest';
import { mswServer } from '../setupTestServer';
import { falilureUploadImageHandler } from '../handlersTestServer';
import { uploadImage } from '../../services/images.service';

describe('uploadImage()', () => {
	it('should make a request and returns the image metadata', async () => {
		const file = new File([], 'image.jpg');
		const meta = await uploadImage(file);
		expect(meta).toEqual(expect.any(Object));
	});

	it('should throw an error if request gone wrong and status > 400 & < 500', async () => {
		mswServer.use(falilureUploadImageHandler);
		const file = new File([], 'image.jpg');
		await expect(uploadImage(file)).rejects.toThrow('bad request');
	});
});
