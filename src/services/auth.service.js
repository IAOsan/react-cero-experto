import { auth, firebaseAuth } from '../firebase/firebase.config';

const errorCodes = {
	// 'auth/popup-closed-by-user': 'Popup closed by user',
	// 'auth/cancelled-popup-request': 'Cancelled popup request',
	'auth/too-many-requests': {
		email: 'Access to this account has been temporarily disabled due to many failed login attempts',
	},
	'auth/email-already-in-use': { email: 'Email already in use' },
	'auth/email-already-exists': { email: 'Email already exists' },
	'auth/invalid-email': {
		email: 'Invalid email. It must be a string email address',
	},
	'auth/user-not-found': { email: 'User not found' },
	'auth/invalid-password': {
		password:
			'Invalid password. It must be a string with at least six characters',
	},
	'auth/wrong-password': {
		password: 'Wrong password',
	},
};

export function handleError(error) {
	const errorCode = error.code;
	const clientError = errorCodes[errorCode];
	if (clientError) {
		throw clientError;
	}
	console.error(error);
}

export function mapUserToView(user) {
	return {
		name: user.displayName,
		email: user.email,
		uid: user.uid,
	};
}

export async function loginGoogle() {
	const provider = new firebaseAuth.GoogleAuthProvider();
	try {
		const res = await firebaseAuth.signInWithPopup(auth, provider);
		return mapUserToView(res.user);
	} catch (error) {
		handleError(error);
	}
}

export async function loginEmailPassword(user) {
	try {
		const res = await firebaseAuth.signInWithEmailAndPassword(
			auth,
			user.email,
			user.password
		);
		return mapUserToView(res.user);
	} catch (error) {
		handleError(error);
	}
}

export async function registerEmailPassword(user) {
	try {
		const res = await firebaseAuth.createUserWithEmailAndPassword(
			auth,
			user.email,
			user.password
		);
		await firebaseAuth.updateProfile(res.user, {
			displayName: user.name,
		});
		return mapUserToView(res.user);
	} catch (error) {
		handleError(error);
	}
}

export async function logout() {
	try {
		await firebaseAuth.signOut(auth);
	} catch (error) {
		throw error;
	}
}

export function authStateListener(observer) {
	return firebaseAuth.onAuthStateChanged(auth, (user) =>
		observer(user ? mapUserToView(user) : user)
	);
}
