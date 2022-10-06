import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Event must have a title'],
	},
	notes: String,
	start: {
		type: Date,
		required: [true, 'Event must have start date'],
	},
	end: {
		type: Date,
		required: [true, 'Event must have end date'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Event must have an owner user'],
	},
});

// remove _i & __v
eventSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default mongoose.model('Event', eventSchema);
