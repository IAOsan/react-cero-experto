import 'vitest';
import { convertFileToBase64 } from '../../constants/utils';

describe('convertFileToBase64()', () => {
	it('should return image into base64', async () => {
		const res = await fetch('https://via.placeholder.com/150C/');
		const blob = await res.blob();
		const file = new File([blob], 'testimage.jpg');

		const result = await convertFileToBase64(file);

		expect(result).toEqual(expect.any(String));
	});
});
