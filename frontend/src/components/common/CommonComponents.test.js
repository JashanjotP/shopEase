import React from 'react';
import { render } from '@testing-library/react';
import { AccountIcon } from './AccountIcon';
import ArrowIcon from './ArrowIcon';
import { CartIcon } from './CartIcon';
import DeleteIcon from './DeleteIcon';
import FbIcon from './FbIcon';
import FilterIcon from './FilterIcon';
import InstaIcon from './InstaIcon';
import SvgCloth from './SvgCloth';
import SvgCreditCard from './SvgCreditCard';
import { SvgEmptyStar } from './SvgEmptyStar';
import SvgFavourite from './SvgFavourite';
import SvgReturn from './SvgReturn';
import SvgShipping from './SvgShipping';
import SvgStarIcon from './SvgStarIcon';
import { Wishlist } from './Wishlist';

describe('Common Components (Icons)', () => {
	test('renders AccountIcon', () => {
		const { container } = render(<AccountIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders ArrowIcon', () => {
		const { container } = render(<ArrowIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders CartIcon', () => {
		const { container } = render(<CartIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders DeleteIcon', () => {
		const { container } = render(<DeleteIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders FbIcon', () => {
		const { container } = render(<FbIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders FilterIcon', () => {
		const { container } = render(<FilterIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders InstaIcon', () => {
		const { container } = render(<InstaIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgCloth', () => {
		const { container } = render(<SvgCloth />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgCreditCard', () => {
		const { container } = render(<SvgCreditCard />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgEmptyStar', () => {
		const { container } = render(<SvgEmptyStar />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgFavourite', () => {
		const { container } = render(<SvgFavourite />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgReturn', () => {
		const { container } = render(<SvgReturn />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgShipping', () => {
		const { container } = render(<SvgShipping />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders SvgStarIcon', () => {
		const { container } = render(<SvgStarIcon />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('renders Wishlist', () => {
		const { container } = render(<Wishlist />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});
});
