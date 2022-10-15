import { rest } from 'msw';
import { events, token } from '../fixtures';

const baseUrl = import.meta.env.VITE_API_URL,
	authEndpoint = `${baseUrl}/api/v1/auth`,
	eventsEndpoint = `${baseUrl}/api/v1/events`;
export let requestTracker = [];

// decoded token
// {
//   "sub": "1234567890",
//   "id": "1",
//   "name": "goku",
//   "email": "user1@mailcom",
//   "iat": 1516239022
// }

afterEach(() => {
	requestTracker = [];
});

function track(req) {
	requestTracker.push({
		method: req.method,
		path: req.url.pathname,
		body: req.body,
		params: { ...req.params },
		headers: req.headers,
		at: new Date().toLocaleTimeString(),
	});
}

const renewToken = rest.get(`${authEndpoint}/renew`, (req, res, ctx) => {
	const token = req.headers.get('x-token');
	track(req);

	if (!token) {
		return res(
			ctx.status(401),
			ctx.json({
				status: 'failed',
				error: {
					token: {
						message: '"Token" is not valid',
					},
				},
			})
		);
	}

	return res(
		ctx.status(200),
		ctx.json({
			status: 'success',
			data: {
				token,
			},
		})
	);
});

const createNewUser = rest.post(`${authEndpoint}/register`, (req, res, ctx) => {
	const { body } = req;
	const status = body.email.includes('existing') ? 400 : 201;
	const json =
		status === 400
			? {
					status: 'failed',
					error: {
						email: 'user already exists',
					},
			  }
			: {
					status: 'success',
					data: {
						user: {
							createdAt: '2022-10-07T12:42:27.400Z',
							name: body.name,
							email: body.email,
							password:
								'$2a$10$ilfLxMWcG7BIqn7CJOA0kOLzFSKonGicxqn.dnK6ZihOtNsFfrJra',
							id: '63401ebd16ee9233687080e1',
							token,
						},
					},
			  };

	track(req);

	return res(ctx.delay(100), ctx.status(status), ctx.json(json));
});

const loginUser = rest.post(authEndpoint, (req, res, ctx) => {
	const { email, password } = req.body;
	const users = [
		{
			id: '63436dbaca274b15e46fc3d0',
			email: 'user1@mail.com',
			name: 'user1',
			password: 'user1password',
		},
		{
			id: '63401ebd16ee9233687080e1',
			email: 'user2@mail.com',
			name: 'user2',
			password: 'user2password',
		},
	];

	track(req);

	const userFound = users.find((u) => u.email === email);

	if (!userFound)
		return res(
			ctx.delay(100),
			ctx.status(404),
			ctx.json({
				status: 'failed',
				error: {
					email: 'user not found',
				},
			})
		);

	const passwordMatch = userFound.password === password;

	if (!passwordMatch)
		return res(
			ctx.delay(100),
			ctx.status(400),
			ctx.json({
				status: 'failed',
				error: {
					password: 'password not match',
				},
			})
		);

	return res(
		ctx.delay(100),
		ctx.status(200),
		ctx.json({
			status: 'success',
			data: {
				user: Object.assign(
					{
						token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiIxIiwibmFtZSI6Imdva3UiLCJlbWFpbCI6InVzZXIxQG1haWxjb20iLCJpYXQiOjE1MTYyMzkwMjJ9.5gK2c3YUFS-q4doWdIiFjOcJH7iBkv3_1BvmyVRxUWg',
					},
					userFound
				),
			},
		})
	);
});

const createNewEvent = rest.post(eventsEndpoint, (req, res, ctx) => {
	track(req);

	return res(
		ctx.status(201),
		ctx.json({
			status: 'success',
			data: {
				event: {
					...req.body,
					id: events.length + 1,
				},
			},
		})
	);
});

const getAllEvents = rest.get(eventsEndpoint, (req, res, ctx) => {
	track(req);

	return res(
		ctx.status(200),
		ctx.json({
			status: 'success',
			data: {
				events,
			},
		})
	);
});

const updateEvent = rest.put(`${eventsEndpoint}/:id`, (req, res, ctx) => {
	const { id } = req.params;
	const eventToUpdate = events.find((e) => e.id === id);

	track(req);
	return res(
		ctx.status(200),
		ctx.json({
			status: 'success',
			data: {
				event: {
					...eventToUpdate,
					...req.body,
				},
			},
		})
	);
});

const deleteAnEvent = rest.delete(`${eventsEndpoint}/:id`, (req, res, ctx) => {
	track(req);
	return res(
		ctx.status(200),
		ctx.json({
			status: 'success',
		})
	);
});

const handlers = [
	renewToken,
	createNewUser,
	loginUser,
	createNewEvent,
	getAllEvents,
	updateEvent,
	deleteAnEvent,
];

export default handlers;
