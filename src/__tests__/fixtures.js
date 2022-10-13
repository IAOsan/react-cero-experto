export const userCredentials = {
	name: 'user1',
	email: 'user1@mail.com',
	password: 'user1password',
};
export const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsInBhc3N3b3JkIjoidXNlcjFwYXNzd29yZCIsImlhdCI6MTUxNjIzOTAyMn0.FrmLf-QnuzzX6BlVBZai8REyrCNvaNo0liHrFyzWrSM';
export const authState = {
	auth: {
		checking: false,
		isAuth: true,
		user: {
			createdAt: '2022-10-09T23:30:44.773Z',
			name: userCredentials.name,
			email: userCredentials.email,
			password:
				'$2a$10$aF3OBaVeYhG4lFpWc5zDiOj4XItKI7.jVKRD4G1DgXQkWUU5L/NhS',
			id: '63436dbaca274b15e46fc3d0',
			token,
		},
	},
};
export const events = [
	{
		id: 1,
		start: '2000-01-20T06:00:00.000Z',
		end: '2000-01-21T06:00:00.000Z',
		title: 'event a',
		notes: '',
		user: {
			name: 'user1',
			id: '63436dbaca274b15e46fc3d0',
		},
	},
	{
		id: 2,
		start: '2000-01-22T06:00:00.000Z',
		end: '2000-01-23T06:00:00.000Z',
		title: 'event b',
		notes: '',
		user: {
			name: 'user1',
			id: '63436dbaca274b15e46fc3d0',
		},
	},
];
