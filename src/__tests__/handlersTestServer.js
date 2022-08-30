import { rest } from 'msw';
import { ENDPOINT as imageUploadEndpoint } from '../services/images.service';

export const successUploadImageHandler = rest.post(
	imageUploadEndpoint,
	(req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				original_filename: 'flowers_image',
				public_id: 'zk2o6c2ubozleypnacvb',
				resource_type: 'image',
				secure_url:
					'https://res.cloudinary.com/dflvdlaev/image/upload/v1661202277/zk2o6c2ubozleypnacvb.jpg',
				signature: 'd7576bed2a9982340283df2da4f31368aa6f5a02',
				type: 'upload',
				url: 'http://res.cloudinary.com/dflvdlaev/image/upload/v1661202277/zk2o6c2ubozleypnacvb.jpg',
				version: 1661202277,
				version_id: '292cffd3a98a787367e998c08caa0e91',
			})
		);
	}
);

export const falilureUploadImageHandler = rest.post(
	imageUploadEndpoint,
	(req, res, ctx) => {
		return res(ctx.status(400), ctx.json('bad request'));
	}
);

export const handlers = [successUploadImageHandler];
