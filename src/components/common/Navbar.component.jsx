import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navbar({ brand, menu, content }) {
	return (
		<nav className='navbar navbar-expand-md navbar-dark bg-dark'>
			<div className='container-fluid'>
				{brand && (
					<Link className='navbar-brand' to='/'>
						{brand.img && <img src={brand.img} alt='' width='50' />}
						{brand.label && <span>{brand.label}</span>}
					</Link>
				)}
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarColor01'
					aria-controls='navbarColor01'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarColor01'>
					<ul className='navbar-nav ms-auto'>
						{menu &&
							menu.map(({ path, label }) => (
								<li key={path} className='nav-item'>
									<Link className='nav-link' to={path}>
										{label}
									</Link>
								</li>
							))}
						{content && content()}
					</ul>
				</div>
			</div>
		</nav>
	);
}

Navbar.propTypes = {
	brand: PropTypes.shape({
		img: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
		label: PropTypes.string,
	}),
	menu: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			path: PropTypes.string,
		})
	),
	content: PropTypes.func,
};

export default Navbar;
