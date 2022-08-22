import { db, firestore } from '../firebase/firebase.config';

function createNote() {
	return {
		title: '',
		body: '',
		createdAt: new Date().toISOString(),
		imageUrl: null,
	};
}

function handleError(error) {
	const errorCode = error.code;
	throw errorCode;
}

function mapNotesToView(docs) {
	return docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function addNewNote(uid) {
	try {
		const newNote = createNote();
		const collRef = firestore.collection(db, `${uid}/journal/notes`);
		const docRef = await firestore.addDoc(collRef, newNote);
		return {
			id: docRef.id,
			...newNote,
		};
	} catch (error) {
		handleError(error);
	}
}

export async function getNotes(uid) {
	try {
		const collRef = firestore.collection(db, `${uid}/journal/notes`);
		const snapshot = await firestore.getDocs(collRef);
		return mapNotesToView(snapshot.docs);
	} catch (error) {
		handleError(error);
	}
}

export async function updateNote(uid, note) {
	try {
		const { id, ...restNote } = note;
		const docRef = firestore.doc(db, `${uid}/journal/notes`, `${id}`);
		await firestore.updateDoc(docRef, restNote);
	} catch (error) {
		handleError(error);
	}
}

export async function removeNote(uid, id) {
	try {
		const docRef = firestore.doc(db, `${uid}/journal/notes`, `${id}`);
		await firestore.deleteDoc(docRef);
	} catch (error) {
		handleError(error);
	}
}
