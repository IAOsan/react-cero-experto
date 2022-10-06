import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: [true, 'User must have a email'],
	},
	password: {
		type: String,
		required: [true, 'User must have a password'],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

// remove _i & __v
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default mongoose.model('User', userSchema);
