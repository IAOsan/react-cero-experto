import React from 'react';
import Entry from './Entry.component';
import PropTypes from 'prop-types';

function Entries({ list }) {
	return (
		<ul className='spacing-y-8 entries'>
			{list.map((itm) => (
				<Entry key={itm.id} {...itm} />
			))}
		</ul>
	);
}

Entries.propTypes = {
	list: PropTypes.array.isRequired,
};

Entries.defaultProps = {
	list: [],
};

export default Entries;
