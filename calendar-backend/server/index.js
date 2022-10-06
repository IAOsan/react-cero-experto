import app from './app.js';

app.listen(process.env.PORT, () => {
	console.log('server listening in port: ', process.env.PORT);
});
