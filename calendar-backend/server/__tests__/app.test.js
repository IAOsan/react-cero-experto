import 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import User from '../models/User.model';
import Event from '../models/Event.model';
import { beforeEach } from 'vitest';

async function clearDb(model) {
	try {
		await model.deleteMany();
	} catch (error) {
		console.log('error when deleting: ', error);
	}
}

const userCredentials = {
	name: 'Aaaa Bbbbb',
	email: 'hola@mail.com',
	password: '12345678',
};

const userCredentialsB = {
	name: 'Cccc Dddd',
	email: 'hola2@mail.com',
	password: '12345678',
};

const event = {
	start: '2022-10-05T05:10:49.501Z',
	end: '2022-10-08T05:10:49.501Z',
	title: 'new event',
	notes: '',
};
const eventB = {
	start: '2022-12-05T05:10:49.501Z',
	end: '2022-12-08T05:10:49.501Z',
	title: 'new event B',
	notes: '',
};

describe('app', () => {
	async function requestLogin(data, status) {
		const path = '/api/v1/auth/';
		const { body } = await request(app)
			.post(path)
			.send(data)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(status);

		return body;
	}

	async function requestRegister(data, status) {
		const path = '/api/v1/auth/register';
		const { body } = await request(app)
			.post(path)
			.send(data)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(status);

		return body;
	}

	async function requestRenew(token, status) {
		const path = '/api/v1/auth/renew';
		const { body } = await request(app)
			.get(path)
			.set('x-token', token)
			.expect('Content-Type', /json/)
			.expect(status);

		return body;
	}

	describe('/== auth ==/', () => {
		describe('/== register ==/', () => {
			const path = '/api/v1/auth/register';

			beforeEach(() => clearDb(User));

			it('should register a user and return user info', async () => {
				const body = await requestRegister(userCredentials, 201);

				expect(body).toEqual({
					status: 'success',
					data: {
						user: {
							...userCredentials,
							password: expect.any(String),
							id: expect.any(String),
							createdAt: expect.any(String),
							token: expect.any(String),
						},
					},
				});
			});

			it('should return a token when a user registers', async () => {
				const body = await requestRegister(userCredentials, 201);

				const token = body.data.user.token;
				const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

				expect(decoded.id).toBe(body.data.user.id);
				expect(decoded.name).toBe(body.data.user.name);
				expect(decoded.email).toBe(body.data.user.email);
			});

			describe('validations', () => {
				it('should return error if name is not provided', async () => {
					const body = await requestRegister(
						{
							email: userCredentials.email,
							password: userCredentials.password,
						},
						400
					);

					expect(body.error.name.message).toBe('"Name" is required');
				});

				it('should return error if name is empty', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: '',
							email: userCredentials.email,
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.name.message).toBe(
						'"Name" is not allowed to be empty'
					);
				});

				it('should return error if name not contains only alphanumeric characters', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: 'name:/-name',
							email: userCredentials.email,
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.name.message).toBe(
						'"Name" should not have special characters'
					);
				});

				it('should return error if email is not provided', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" is required'
					);
				});

				it('should return error if email is empty', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: '',
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" is not allowed to be empty'
					);
				});

				it('should return error if email is not valid', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: 'email',
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" must be a valid email'
					);
				});

				it('should return error if email already exists', async () => {
					await request(app)
						.post(path)
						.send(userCredentials)
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(201);

					const { body } = await request(app)
						.post(path)
						.send(userCredentials)
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" already exists'
					);
				});

				it('should return error if password is not provided', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: userCredentials.email,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" is required'
					);
				});

				it('should return error if password is empty', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: userCredentials.email,
							password: '',
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" is not allowed to be empty'
					);
				});

				it('should return error if password is not an string', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: userCredentials.email,
							password: 123,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" must be a string'
					);
				});

				it('should return error if password is less than 8 characters', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: userCredentials.email,
							password: '12345',
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" length must be at least 8 characters long'
					);
				});

				it('should return error if password contains not alphanumeric characters', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							name: userCredentials.name,
							email: userCredentials.email,
							password: 'Pass-w*rd',
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" must only contain alpha-numeric characters'
					);
				});
			});
		});

		describe('/== login ==/', () => {
			const path = '/api/v1/auth/';

			afterEach(() => clearDb(User));

			it('should authenticate and return user info', async () => {
				await requestRegister(userCredentials, 201);

				const body = await requestLogin(
					{
						email: userCredentials.email,
						password: userCredentials.password,
					},
					200
				);

				expect(body).toEqual({
					status: 'success',
					data: {
						user: {
							...userCredentials,
							password: expect.any(String),
							id: expect.any(String),
							createdAt: expect.any(String),
							token: expect.any(String),
						},
					},
				});
			});

			it('should return a token when a user authenticates', async () => {
				await requestRegister(userCredentials, 201);

				const body = await requestLogin(
					{
						email: userCredentials.email,
						password: userCredentials.password,
					},
					200
				);

				const decoded = jwt.verify(
					body.data.user.token,
					process.env.JWT_PRIVATE_KEY
				);

				expect(decoded.id).toBe(body.data.user.id);
				expect(decoded.name).toBe(body.data.user.name);
				expect(decoded.email).toBe(body.data.user.email);
			});

			describe('validation', () => {
				it('should return error if email is not provided', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" is required'
					);
				});

				it('should return error if email is empty', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: '',
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" is not allowed to be empty'
					);
				});

				it('should return error if email is not valid', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: 'email',
							password: userCredentials.password,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.email.message).toBe(
						'"Email" must be a valid email'
					);
				});

				it('should return error if password is not provided', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: userCredentials.email,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" is required'
					);
				});

				it('should return error if password is empty', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: userCredentials.email,
							password: '',
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" is not allowed to be empty'
					);
				});

				it('should return error if password is not an string', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: userCredentials.email,
							password: 123,
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" must be a string'
					);
				});

				it('should return error if password is less than 8 characters', async () => {
					const { body } = await request(app)
						.post(path)
						.send({
							email: userCredentials.email,
							password: '12345',
						})
						.set('Accept', 'application/json')
						.expect('Content-Type', /json/)
						.expect(400);

					expect(body.error.password.message).toBe(
						'"Password" length must be at least 8 characters long'
					);
				});

				it('should return error if password contains not alphanumeric characters', async () => {
					const body = await requestLogin(
						{
							email: userCredentials.email,
							password: 'Pass-w*rd',
						},
						400
					);

					expect(body.error.password.message).toBe(
						'"Password" must only contain alpha-numeric characters'
					);
				});

				it('should return an error if user is not found', async () => {
					const body = await requestLogin(
						{
							email: 'test@mail.com',
							password: '12345678',
						},
						404
					);

					expect(body).toEqual({
						status: 'failed',
						error: {
							email: {
								message: '"User" not exists',
							},
						},
					});
				});

				it('should return an error if password is wrong', async () => {
					await requestRegister(userCredentials, 201);

					const body = await requestLogin(
						{
							email: userCredentials.email,
							password: 'helloworldd',
						},
						400
					);

					expect(body).toEqual({
						status: 'success',
						error: {
							password: {
								message: '"Password" does not match',
							},
						},
					});
				});
			});
		});

		describe('/== renew ==/', () => {
			beforeEach(() => clearDb(User));

			it('should return a new token', async () => {
				const user = await requestRegister(userCredentials, 201);
				const body = await requestRenew(user.data.user.token, 200);
				const decoded = jwt.verify(
					body.data.token,
					process.env.JWT_PRIVATE_KEY
				);

				expect(body).toEqual({
					status: 'success',
					data: { token: expect.any(String) },
				});

				expect(decoded.id).toBe(user.data.user.id);
				expect(decoded.email).toBe(user.data.user.email);
				expect(decoded.name).toBe(user.data.user.name);
			});

			describe('validation', () => {
				it('should return an error if token is not sent', async () => {
					const body = await requestRenew('', 401);

					expect(body).toEqual({
						status: 'failed',
						error: {
							token: {
								message: '"Token" has not been sent',
							},
						},
					});
				});

				it('should return an error if token is not valid', async () => {
					const body = await requestRenew('sometoken', 401);

					expect(body).toEqual({
						status: 'failed',
						error: {
							token: {
								message: '"Token" is not valid',
							},
						},
					});
				});
			});
		});
	});

	describe('/== events ==/', () => {
		const path = '/api/v1/events';
		let token, tokenB;

		async function postNewEvent(data, code) {
			const { body } = await request(app)
				.post(path)
				.send(data)
				.set('x-token', token)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(code);
			return body;
		}

		async function getEvents(id, code = 200) {
			const p = id ? `${path}/${id}` : path;

			const { body } = await request(app)
				.get(p)
				.set('x-token', token)
				.expect('Content-Type', /json/)
				.expect(code);
			return body;
		}

		async function updateEvent(overrides) {
			const { id, update, tkn, status } = {
				id: '',
				update: {},
				tkn: token,
				status: 200,
				...overrides,
			};

			const { body } = await request(app)
				.put(`${path}/${id}`)
				.send(update)
				.set('x-token', tkn)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(status);

			return body;
		}

		async function deleteEvent(overrides) {
			const { id, tkn, status } = {
				id: '',
				tkn: token,
				status: 200,
				...overrides,
			};
			const { body } = await request(app)
				.delete(`${path}/${id}`)
				.set('x-token', tkn)
				.expect('Content-Type', /json/)
				.expect(status);
			return body;
		}

		beforeAll(async () => {
			const userA = await requestRegister(userCredentials, 201);
			token = userA.data.user.token;
			const userB = await requestRegister(userCredentialsB, 201);
			tokenB = userB.data.user.token;
		});

		afterAll(() => {
			clearDb(User);
		});

		describe('/== create ==/', () => {
			beforeEach(async () => {
				await clearDb(Event);
			});

			it('should add new event', async () => {
				const body = await postNewEvent(event, 201);

				expect(body).toEqual({
					status: 'success',
					data: {
						event: {
							...event,
							id: expect.any(String),
							user: expect.any(String),
						},
					},
				});
			});

			describe('validation', () => {
				it('should return an error if start date not exists', async () => {
					const { end, title, notes } = event;
					const body = await postNewEvent({ end, title, notes }, 400);

					expect(body.error.start.message).toEqual(
						'"Start date" is required'
					);
				});

				it('should return an error if start date is not a date', async () => {
					const { end, title, notes } = event;
					const body = await postNewEvent(
						{ start: 'start date', end, title, notes },
						400
					);

					expect(body.error.start.message).toEqual(
						'"Start date" must be a valid date'
					);
				});

				it('should return an error if end date not exists', async () => {
					const { start, title, notes } = event;
					const body = await postNewEvent(
						{ start, title, notes },
						400
					);

					expect(body.error.end.message).toEqual(
						'"End date" is required'
					);
				});

				it('should return an error if end date is not a date', async () => {
					const { start, title, notes } = event;
					const body = await postNewEvent(
						{ start, end: 'end date', title, notes },
						400
					);

					expect(body.error.end.message).toEqual(
						'"End date" must be a valid date'
					);
				});

				it('should return an error if end date is less than start date', async () => {
					const { start, title, notes } = event;
					const body = await postNewEvent(
						{
							start,
							end: '2022-10-01T05:10:49.501Z',
							title,
							notes,
						},
						400
					);

					expect(body.error.end.message).toEqual(
						'"End Date" must be greater than "Start date"'
					);
				});

				it('should return an error if title not exists', async () => {
					const { start, end, notes } = event;
					const body = await postNewEvent(
						{
							start,
							end,
							notes,
						},
						400
					);

					expect(body.error.title.message).toEqual(
						'"Title" is required'
					);
				});

				it('should return an error if title has no more than four characters', async () => {
					const { start, end, notes } = event;
					const body = await postNewEvent(
						{
							start,
							title: 't',
							end,
							notes,
						},
						400
					);

					expect(body.error.title.message).toEqual(
						'"Title" length must be at least 4 characters long'
					);
				});

				it('should return an error if title includes non alphanumeric characters', async () => {
					const { start, end, notes } = event;
					const body = await postNewEvent(
						{
							start,
							title: 'new-title ::D',
							end,
							notes,
						},
						400
					);

					expect(body.error.title.message).toEqual(
						'"Title" should not contain special characters'
					);
				});

				it('should return an error if notes includes special characters', async () => {
					const { start, end, title } = event;
					const body = await postNewEvent(
						{
							start,
							end,
							title,
							notes: 'notes:whith/special-characters',
						},
						400
					);

					expect(body.error.notes.message).toEqual(
						'"Notes" should not contain special characters'
					);
				});
			});
		});

		describe('/== get all ==/', () => {
			beforeEach(async () => {
				await postNewEvent(event, 201);
				await postNewEvent(eventB, 201);
			});
			afterEach(async () => {
				await clearDb(Event);
			});

			it('should return all events', async () => {
				const {
					data: { events },
				} = await getEvents();

				expect(events).toHaveLength(2);
				expect(events.find((e) => e.name === event.name)).toBeTruthy();
				expect(events.find((e) => e.name === eventB.name)).toBeTruthy();
			});

			it('should return each event with owner user name', async () => {
				const {
					data: { events },
				} = await getEvents();

				expect(events.every((o) => !!o.user.name)).toBe(true);
			});
		});

		describe('/== update ==/', () => {
			const update = {
				...eventB,
				title: 'event B updated',
				notes: 'notes added to event b',
			};

			beforeEach(async () => {
				await postNewEvent(event, 201);
				await postNewEvent(eventB, 201);
			});
			afterEach(async () => {
				await clearDb(Event);
			});

			it('should update an event', async () => {
				const events = await getEvents();
				const id = events.data.events[1].id;

				const body = await updateEvent({ id, update });

				expect(body.data.event.title).toEqual(update.title);
				expect(body.data.event.notes).toEqual(update.notes);
			});

			describe('validation', () => {
				it('should returns an error if event not exists', async () => {
					const id = '2953f0e6a04826709b0f269b';
					const body = await updateEvent({ id, update, status: 404 });

					expect(body).toEqual({
						status: 'failed',
						error: {
							message: '"Event" not found',
						},
					});
				});

				it("should return an error if trying to update another user's event", async () => {
					const events = await getEvents();
					const id = events.data.events[0].id;

					const body = await updateEvent({
						id,
						update,
						status: 401,
						tkn: tokenB,
					});

					expect(body).toEqual({
						status: 'failed',
						error: {
							message: 'You are not authorized',
						},
					});
				});
			});
		});

		describe('/== delete ==/', () => {
			beforeEach(async () => {
				await postNewEvent(event, 201);
				await postNewEvent(eventB, 201);
			});
			afterEach(async () => {
				await clearDb(Event);
			});

			it('should delete an event', async () => {
				const events = await getEvents();
				const id = events.data.events[0].id;

				const body = await deleteEvent({
					id,
					status: 200,
				});

				expect(body).toEqual({
					status: 'success',
				});
			});

			describe('validation', () => {
				it('should return an error if event not exists', async () => {
					const id = 'e044dcd7210617ec2794af5d';

					const body = await deleteEvent({
						id,
						status: 404,
					});

					expect(body).toEqual({
						status: 'failed',
						error: {
							message: '"Event" not found',
						},
					});
				});

				it('should return an error if trying to delete event from another user', async () => {
					const events = await getEvents();
					const id = events.data.events[0].id;

					const body = await deleteEvent({
						id,
						tkn: tokenB,
						status: 401,
					});

					expect(body).toEqual({
						status: 'failed',
						error: {
							message: 'You are not authorized',
						},
					});
				});
			});
		});
	});
});
