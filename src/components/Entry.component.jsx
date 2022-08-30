import React from 'react';
import { useDispatch } from 'react-redux';
import { selectNote } from '../store/slices/notes/notes.slice';
import PropTypes from 'prop-types';

export function generateEntryDate(timeStamp) {
	const date = new Date(timeStamp);
	const dayWeek = date.toLocaleDateString('en-US', {
		weekday: 'long',
	});
	const dateNumber = date.getDate();

	return {
		date: dateNumber,
		day: dayWeek,
	};
}

function Entry({ id, body, title, imageUrl, createdAt }) {
	const dispatch = useDispatch();
	const { date, day } = generateEntryDate(createdAt);

	return (
		<li className='anima-fade-in-bottom'>
			<button
				onClick={() => dispatch(selectNote(id))}
				className='btn w-100 flex entry'
				type='button'
			>
				{imageUrl && (
					<div
						style={{
							'--bg': `url(${imageUrl})`,
						}}
						className='entry__img-box'
					></div>
				)}
				<div className='entry__body'>
					<h3 className='font-body mb-8'>
						{title || 'Title is empty'}
					</h3>
					<p>{body || 'Description is empty'}</p>
				</div>
				<div className='flex flex-ai-c flex-jc-c text-center entry__date'>
					<p>
						<span>{day}</span>
						<br />
						<strong>{date}</strong>
					</p>
				</div>
			</button>
		</li>
	);
}

Entry.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	body: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	imageUrl: PropTypes.string,
	createdAt: PropTypes.string.isRequired,
};

export default Entry;
