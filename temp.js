const http = {
	base_url: 'baseurl',
	get() {
		console.log(this.base_url, '/get');
	},
	post() {
		console.log(this.base_url, '/post');
	},
	put() {
		console.log(this.base_url, '/put');
	},
	delete() {
		console.log(this.base_url, '/delete');
	},
};

http.get();
