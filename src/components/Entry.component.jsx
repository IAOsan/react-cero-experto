import React from 'react';
import { useDispatch } from 'react-redux';
import { selectNote } from '../store/slices/notes/notes.slice';
import PropTypes from 'prop-types';

function Entry({ id, body, title, imageUrl, createdAt }) {
	const dispatch = useDispatch();
	const date = new Date(createdAt);
	const dayWeek = date.toLocaleDateString('en-US', {
		weekday: 'long',
	});
	const dateNumber = date.getDate();

	function handleClick() {
		dispatch(selectNote(id));
	}

	return (
		<article className='anima-fade-in-bottom'>
			<button
				onClick={handleClick}
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
						<span>{dayWeek}</span>
						<br />
						<strong>{dateNumber}</strong>
					</p>
				</div>
			</button>
		</article>
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
