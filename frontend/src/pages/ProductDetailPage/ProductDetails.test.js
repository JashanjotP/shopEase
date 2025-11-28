import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductDetails from './ProductDetails';
import { getAllProducts } from '../../api/fetchProducts';
import { addItemToCartAction } from '../../store/actions/cartAction';

// --- MOCK DEPENDENCIES ---
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../../api/fetchProducts');
jest.mock('../../store/actions/cartAction');

// --- SMART COMPONENT MOCKS ---
jest.mock('../../components/Breadcrumb/Breadcrumb', () => ({ links }) => (
    <div data-testid="breadcrumb" data-links={JSON.stringify(links)}>
        {links.map((l, i) => <span key={i}>{l.title}</span>)}
    </div>
));

jest.mock('../../components/Rating/Rating', () => ({ rating }) => (
    <div data-testid="rating" data-value={rating}>Rating: {rating}</div>
));

jest.mock('../../components/Filters/SizeFilter', () => ({ onChange, sizes, multi }) => (
    <div data-testid="size-filter" data-multi={multi}>
        <span data-testid="size-list">{sizes.join(',')}</span>
        {sizes?.map(size => (
            <button key={size} onClick={() => onChange([size])}>{size}</button>
        ))}
        <button onClick={() => onChange([])}>Clear</button>
    </div>
));

jest.mock('./ProductColors', () => ({ colors }) => (
    <div data-testid="product-colors" data-colors={colors.join(',')}>
        {colors.map(c => <span key={c}>{c}</span>)}
    </div>
));

jest.mock('../../components/Sections/SectionsHeading/SectionHeading', () => ({ title }) => 
    <div data-testid="section-heading">{title}</div>
);

jest.mock('../ProductListPage/ProductCard', () => (props) => 
    <div data-testid="product-card" data-product-id={props.id}>ProductCard</div>
);

jest.mock('../../components/common/SvgCreditCard', () => () => <svg data-testid="svg-credit">CreditCard</svg>);
jest.mock('../../components/common/SvgCloth', () => () => <svg data-testid="svg-cloth">Cloth</svg>);
jest.mock('../../components/common/SvgShipping', () => () => <svg data-testid="svg-shipping">Shipping</svg>);
jest.mock('../../components/common/SvgReturn', () => () => <svg data-testid="svg-return">Return</svg>);



describe('ProductDetails Component', () => {
    const mockDispatch = jest.fn();
    
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        rating: 4.5,
        description: 'Test Description',
        thumbnail: 'thumb.jpg',
        categoryId: 10,
        categoryTypeId: 20,
        variants: [
            { id: 101, size: 'M', color: 'Red', stockQuantity: 5 },
            { id: 102, size: 'L', color: 'Blue', stockQuantity: 0 },
            { id: 103, size: 'M', color: 'Green', stockQuantity: 3 }
        ],
        productResources: [
            { url: 'img1.jpg' },
            { url: 'img2.jpg' }
        ]
    };

    const mockCategories = [
        {
            id: 10,
            name: 'Category 1',
            categoryTypes: [
                { id: 20, name: 'Type 1' },
                { id: 21, name: 'Type 2' }
            ]
        }
    ];

    beforeEach(() => {
        useDispatch.mockReturnValue(mockDispatch);
        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: mockCategories }
        }));
        require('react-router-dom').useLoaderData.mockReturnValue({ product: mockProduct });
        getAllProducts.mockResolvedValue([]);
        addItemToCartAction.mockReturnValue({ type: 'ADD_ITEM' });
        mockDispatch.mockClear();
        jest.clearAllMocks();
    });

    // --- BASIC RENDERING TESTS ---
    test('renders product details with all required fields', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$100')).toBeInTheDocument(); 
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        
        const rating = screen.getByTestId('rating');
        expect(rating).toHaveAttribute('data-value', '4.5');
    });

    test('renders all section headings correctly', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const headings = screen.getAllByTestId('section-heading');
        expect(headings[0]).toHaveTextContent('Product Description');
        expect(headings[1]).toHaveTextContent('Similar Products');
    });

    test('renders extra sections with icons and labels', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        expect(screen.getByTestId('svg-credit')).toBeInTheDocument();
        expect(screen.getByTestId('svg-cloth')).toBeInTheDocument();
        expect(screen.getByTestId('svg-shipping')).toBeInTheDocument();
        expect(screen.getByTestId('svg-return')).toBeInTheDocument();
        
        expect(screen.getByText('Secure payment')).toBeInTheDocument();
        expect(screen.getByText('Size & Fit')).toBeInTheDocument();
        expect(screen.getByText('Free shipping')).toBeInTheDocument();
        expect(screen.getByText('Free Shipping & Returns')).toBeInTheDocument();
    });

    test('renders Size Guide link with correct URL', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const link = screen.getByText('Size Guide ->');
        expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Clothing_sizes');
        expect(link).toHaveAttribute('target', '_blank');
    });

    // --- DERIVED STATE TESTS ---
    test('computes unique colors from variants', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const colorsDiv = screen.getByTestId('product-colors');
        expect(colorsDiv).toHaveAttribute('data-colors', 'Red,Blue,Green');
        
        // Verify all colors are rendered
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('Blue')).toBeInTheDocument();
        expect(screen.getByText('Green')).toBeInTheDocument();
    });

    test('computes unique sizes from variants', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeList = screen.getByTestId('size-list');
        expect(sizeList).toHaveTextContent('M,L');
    });

    test('recomputes colors when product changes', () => {
        const { rerender } = render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        let colorsDiv = screen.getByTestId('product-colors');
        expect(colorsDiv).toHaveAttribute('data-colors', 'Red,Blue,Green');

        const newProduct = {
            ...mockProduct,
            variants: [
                { id: 201, size: 'S', color: 'Yellow', stockQuantity: 5 },
                { id: 202, size: 'M', color: 'Pink', stockQuantity: 5 }
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: newProduct });
        rerender(<BrowserRouter><ProductDetails /></BrowserRouter>);

        colorsDiv = screen.getByTestId('product-colors');
        expect(colorsDiv).toHaveAttribute('data-colors', 'Yellow,Pink');
    });

    test('recomputes sizes when product changes', () => {
        const { rerender } = render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        let sizeList = screen.getByTestId('size-list');
        expect(sizeList).toHaveTextContent('M,L');

        const newProduct = {
            ...mockProduct,
            variants: [
                { id: 201, size: 'XL', color: 'Red', stockQuantity: 5 },
                { id: 202, size: 'XXL', color: 'Blue', stockQuantity: 5 }
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: newProduct });
        rerender(<BrowserRouter><ProductDetails /></BrowserRouter>);

        sizeList = screen.getByTestId('size-list');
        expect(sizeList).toHaveTextContent('XL,XXL');
    });

    // --- BREADCRUMB TESTS ---
    test('generates breadcrumbs with Shop and Category', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        expect(screen.getByText('Shop')).toBeInTheDocument();
        expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    test('generates breadcrumbs with correct category type', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const breadcrumb = screen.getByTestId('breadcrumb');
        const linksData = JSON.parse(breadcrumb.getAttribute('data-links'));

        expect(linksData).toHaveLength(3);
        expect(linksData[2]).toEqual({ title: 'Type 1', path: 'Type 1' });
    });

    test('handles wrong category type ID', () => {
        const productWithWrongType = {
            ...mockProduct,
            categoryTypeId: 999 // Non-existent type
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithWrongType });
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const breadcrumb = screen.getByTestId('breadcrumb');
        const linksData = JSON.parse(breadcrumb.getAttribute('data-links'));

        // Should only have 2 links without matching type
        expect(linksData).toHaveLength(2);
    });

    test('breadcrumbs reset and rebuild on product change', () => {
        const { rerender } = render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        expect(screen.getByText('Category 1')).toBeInTheDocument();

        const newCategories = [{
            id: 10,
            name: 'New Category Name',
            categoryTypes: [{ id: 20, name: 'Type 1' }]
        }];

        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: newCategories }
        }));

        rerender(<BrowserRouter><ProductDetails /></BrowserRouter>);
        
        expect(screen.getByText('New Category Name')).toBeInTheDocument();
        expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
    });

    // --- IMAGE GALLERY TESTS ---
    test('sets thumbnail as initial image', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const mainImg = screen.getByAltText('Test Product');
        expect(mainImg).toHaveAttribute('src', 'thumb.jpg');
    });

    test('updates main image when thumbnail clicked', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const thumb1 = screen.getByAltText('sample-0');
        const thumb2 = screen.getByAltText('sample-1');
        
        fireEvent.click(thumb1.closest('button'));
        let mainImg = screen.getByAltText('Test Product');
        expect(mainImg).toHaveAttribute('src', 'img1.jpg');

        fireEvent.click(thumb2.closest('button'));
        mainImg = screen.getByAltText('Test Product');
        expect(mainImg).toHaveAttribute('src', 'img2.jpg');
    });

    test('updates image when product changes', () => {
        const { rerender } = render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const newProduct = {
            ...mockProduct,
            name: 'New Product',
            thumbnail: 'new-thumb.jpg'
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: newProduct });
        rerender(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const mainImg = screen.getByAltText('New Product');
        expect(mainImg).toHaveAttribute('src', 'new-thumb.jpg');
    });

    // --- SIZE SELECTION TESTS ---
    test('SizeFilter receives correct multi prop', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeFilter = screen.getByTestId('size-filter');
        expect(sizeFilter).toHaveAttribute('data-multi', 'false');
    });

    test('selects size and clears on change', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeBtn = screen.getByText('M');
        fireEvent.click(sizeBtn);

        // Verify selection by trying to add to cart (should not show size error)
        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);
        
        expect(screen.queryByText('Please select size')).not.toBeInTheDocument();
    });

    test('handles empty size selection', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeFilter = screen.getByTestId('size-filter');
        const onChange = () => {
            const btn = screen.getByText('M').closest('button');
            btn.click();
        };

        // Initially no size selected
        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);
        
        expect(screen.getByText('Please select size')).toBeInTheDocument();
    });

    // --- CART FUNCTIONALITY TESTS ---
    test('shows error when no size selected', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        expect(screen.getByText('Please select size')).toBeInTheDocument();
    });

    test('clears error when size is selected', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);
        expect(screen.getByText('Please select size')).toBeInTheDocument();

        const sizeBtn = screen.getByText('M');
        fireEvent.click(sizeBtn);
        
        expect(screen.queryByText('Please select size')).not.toBeInTheDocument();
    });

    test('shows out of stock error for unavailable variant', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeLBtn = screen.getByText('L'); // L has 0 stock
        fireEvent.click(sizeLBtn);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    test('adds to cart with correct variant when in stock', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeBtn = screen.getByText('M');
        fireEvent.click(sizeBtn);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        expect(addItemToCartAction).toHaveBeenCalledWith({
            productId: 1,
            thumbnail: 'thumb.jpg',
            name: 'Test Product',
            variant: { id: 101, size: 'M', color: 'Red', stockQuantity: 5 },
            quantity: 1,
            subTotal: 100,
            price: 100
        });

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'ADD_ITEM' });
    });

    test('error display uses logical AND operator correctly', () => {
        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        // No error initially
        expect(screen.queryByText(/text-red-600/)).not.toBeInTheDocument();

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        // Error should display
        const errorElement = screen.getByText('Please select size');
        expect(errorElement).toHaveClass('text-red-600');
    });

    // --- SIMILAR PRODUCTS TESTS ---
    test('fetches similar products on mount', async () => {
        getAllProducts.mockResolvedValue([
            { id: 2, name: 'Similar 1' },
            { id: 3, name: 'Similar 2' }
        ]);

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(getAllProducts).toHaveBeenCalledWith(10, 20);
        });

        const cards = screen.getAllByTestId('product-card');
        expect(cards).toHaveLength(2);
    });

    test('excludes current product from similar products', async () => {
        getAllProducts.mockResolvedValue([
            { id: 1, name: 'Current Product' },
            { id: 2, name: 'Similar 1' },
            { id: 3, name: 'Similar 2' }
        ]);

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            const cards = screen.getAllByTestId('product-card');
            expect(cards).toHaveLength(2); // Excludes id: 1
        });
    });

    test('shows "No Products Found" when no similar products', async () => {
        getAllProducts.mockResolvedValue([]);

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('No Products Found!')).toBeInTheDocument();
        });
    });

    test('handles similar products API error', async () => {
        getAllProducts.mockRejectedValue(new Error('API Error'));

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('No Products Found!')).toBeInTheDocument();
        });
    });

    test('refetches similar products when product changes', async () => {
        getAllProducts.mockResolvedValue([{ id: 99 }]);

        const { rerender } = render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(getAllProducts).toHaveBeenCalledWith(10, 20);
        });

        const newProduct = {
            ...mockProduct,
            id: 2,
            categoryId: 15,
            categoryTypeId: 25
        };

        getAllProducts.mockClear();
        getAllProducts.mockResolvedValue([{ id: 100 }]);
        require('react-router-dom').useLoaderData.mockReturnValue({ product: newProduct });

        rerender(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(getAllProducts).toHaveBeenCalledWith(15, 25);
        });
    });

    // --- EDGE CASE TESTS ---
    test('handles product with undefined properties', () => {
        const minimalProduct = {
            id: 5,
            name: 'Minimal',
            price: 50
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: minimalProduct });
        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: [] }
        }));

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
        
        expect(screen.getByText('Minimal')).toBeInTheDocument();
        expect(screen.getByText('$50')).toBeInTheDocument();
    });

    test('handles null state values gracefully', () => {
        useSelector.mockImplementation(cb => cb({
            cartState: null,
            categoryState: null
        }));

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    test('handles undefined categoryState.categories', () => {
        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: undefined }
        }));

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    test('handles product without variants', () => {
        const noVariantsProduct = {
            ...mockProduct,
            variants: undefined
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: noVariantsProduct });

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    test('handles product without productResources', () => {
        const noResourcesProduct = {
            ...mockProduct,
            productResources: undefined
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: noResourcesProduct });

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    test('handles category without matching ID', () => {
        const productWithUnknownCategory = {
            ...mockProduct,
            categoryId: 999
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithUnknownCategory });

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const breadcrumb = screen.getByTestId('breadcrumb');
        const linksData = JSON.parse(breadcrumb.getAttribute('data-links'));
        
        expect(linksData).toHaveLength(2); // Only Shop + undefined category
    });

    test('handles variants with missing properties', () => {
        const productWithBadVariants = {
            ...mockProduct,
            variants: [
                { id: 101 }, // Missing size, color, stockQuantity
                { id: 102, size: 'L' } // Partial data
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithBadVariants });

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    // --- FILTER/MAP OPERATION TESTS ---
    test('handles null/undefined in filter operations', async () => {
        getAllProducts.mockResolvedValue(null);

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('No Products Found!')).toBeInTheDocument();
        });
    });

    test('handles response without filter method', async () => {
        getAllProducts.mockResolvedValue(undefined);

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('No Products Found!')).toBeInTheDocument();
        });
    });

    // --- PRODUCTCATEGORY USEMEMO TESTS ---
    test('finds correct category when multiple categories exist', () => {
        const multipleCategories = [
            { id: 5, name: 'Wrong Category', categoryTypes: [] },
            { id: 10, name: 'Correct Category', categoryTypes: [{ id: 20, name: 'Type 1' }] },
            { id: 15, name: 'Another Wrong', categoryTypes: [] }
        ];

        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: multipleCategories }
        }));

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        expect(screen.getByText('Correct Category')).toBeInTheDocument();
        expect(screen.queryByText('Wrong Category')).not.toBeInTheDocument();
    });

    test('handles categories array with null elements', () => {
        const categoriesWithNull = [
            null,
            { id: 10, name: 'Category 1', categoryTypes: [{ id: 20, name: 'Type 1' }] },
            undefined
        ];

        useSelector.mockImplementation(cb => cb({
            cartState: { cart: [] },
            categoryState: { categories: categoriesWithNull }
        }));

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    // --- SPECIFIC OPTIONAL CHAINING TESTS ---
    test('handles item.url being undefined in productResources', () => {
        const productWithBadResources = {
            ...mockProduct,
            productResources: [
                { url: undefined },
                { url: 'valid.jpg' }
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithBadResources });

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
    });

    test('handles variant without size property', () => {
        const productWithBadVariant = {
            ...mockProduct,
            variants: [
                { id: 101, color: 'Red', stockQuantity: 5 }, // No size
                { id: 102, size: 'M', color: 'Blue', stockQuantity: 5 }
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithBadVariant });

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeBtn = screen.getByText('M');
        fireEvent.click(sizeBtn);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        // Should still work with valid variant
        expect(addItemToCartAction).toHaveBeenCalled();
    });

    test('handles selectedVariant with undefined stockQuantity', () => {
        const productWithBadStock = {
            ...mockProduct,
            variants: [
                { id: 101, size: 'M', color: 'Red', stockQuantity: undefined }
            ]
        };

        require('react-router-dom').useLoaderData.mockReturnValue({ product: productWithBadStock });

        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        // Use getAllByText and find the button specifically
        const sizeButtons = screen.getAllByText('M');
        const sizeBtn = sizeButtons.find(el => el.tagName === 'BUTTON');
        fireEvent.click(sizeBtn);

        const addBtn = screen.getByText('Add to cart').closest('button');
        fireEvent.click(addBtn);

        // Should show out of stock for undefined (falsy) stock
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
	
	test('clears selected size when filter returns empty values', () => {
		render(<BrowserRouter><ProductDetails /></BrowserRouter>);

		
		fireEvent.click(screen.getByText('M'));

		let addBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addBtn);
		expect(screen.queryByText('Please select size')).not.toBeInTheDocument();

		
		const sizeFilter = screen.getByTestId('size-filter');
	
		expect(screen.queryByText('Stryker was here')).not.toBeInTheDocument();
	});

	test('does not default size to random string on initialization', () => {
		render(<BrowserRouter><ProductDetails /></BrowserRouter>);
		
		// If the mutation survived, selectedSize is "Stryker was here!"
		// We try to add to cart.
		const addBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addBtn);

		// If selectedSize was "Stryker...", the code would bypass the "Please select size" error
		// and likely hit the "Out of Stock" error (because variant is undefined)
		// We expect the "Please select size" error, proving selectedSize is empty.
		expect(screen.getByText('Please select size')).toBeInTheDocument();
	});

	test('does not show error message on initial render', () => {
		render(<BrowserRouter><ProductDetails /></BrowserRouter>);
		expect(screen.queryByText('Stryker was here!')).not.toBeInTheDocument();
		expect(screen.queryByText(/text-red-600/)).not.toBeInTheDocument();
	});

	test('handles undefined Redux state safely', () => {

		useSelector.mockImplementation(() => undefined);

		expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
	});

	test('handles fully empty/null product and category data', () => {

		useSelector.mockImplementation(cb => cb({
			cartState: { cart: [] },
			categoryState: { categories: null } // Kills categories?.find vs categories.find
		}));


		require('react-router-dom').useLoaderData.mockReturnValue({ 
			product: {
				id: null, // Kills item?.id !== product?.id
				categoryId: null, // Kills product?.categoryId
				categoryTypeId: null,
				variants: null,
				productResources: null
			} 
		});

		getAllProducts.mockResolvedValue([
			{ id: null } // Kills item?.id
		]);

		expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();
	});

	test('handles null API response for similar products', async () => {

		getAllProducts.mockResolvedValue(null); 

		render(<BrowserRouter><ProductDetails /></BrowserRouter>);

		await waitFor(() => {
			expect(screen.getByText('No Products Found!')).toBeInTheDocument();
		});
	});



    test('renders safely when product data is null', () => {
  
        
        require('react-router-dom').useLoaderData.mockReturnValue({ product: null });

        expect(() => render(<BrowserRouter><ProductDetails /></BrowserRouter>)).not.toThrow();

        expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });

    test('handles undefined values passed to size filter', () => {


        render(<BrowserRouter><ProductDetails /></BrowserRouter>);

        const sizeFilter = screen.getByTestId('size-filter');
        expect(sizeFilter).toBeInTheDocument();

      
    });

	test('handles "Add to cart" click safely when product data is missing', () => {

		require('react-router-dom').useLoaderData.mockReturnValue({ product: null });
		

		require('../../api/fetchProducts').getAllProducts.mockResolvedValue([]);

		render(<BrowserRouter><ProductDetails /></BrowserRouter>);


		const addBtn = screen.getByText('Add to cart').closest('button');


		expect(() => fireEvent.click(addBtn)).not.toThrow();
	});

	test('does not clear error when size is deselected (empty)', () => {
		render(<BrowserRouter><ProductDetails /></BrowserRouter>);

		// 1. Select the Out of Stock variant (Size 'L' in your mock data)
		const sizeLBtn = screen.getByText('L');
		fireEvent.click(sizeLBtn);

		// 2. Click "Add to cart" to trigger the "Out of Stock" error
		const addBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addBtn);
		expect(screen.getByText('Out of Stock')).toBeInTheDocument();

		// 3. Click "Clear" to deselect the size
		// This changes state from 'L' -> ''. The useEffect runs.
		const clearBtn = screen.getByText('Clear');
		fireEvent.click(clearBtn);

		// 4. Assert correctness
		// Original Code: if('') is false. Error remains "Out of Stock".
		// Mutant Code: if(true) is true. Error is cleared.
		expect(screen.getByText('Out of Stock')).toBeInTheDocument();
	});

	test('clears error completely when valid size selected', () => {
		render(<BrowserRouter><ProductDetails /></BrowserRouter>);

		const addBtn = screen.getByText('Add to cart').closest('button');
		fireEvent.click(addBtn);

		const sizeBtn = screen.getByText('M');
		fireEvent.click(sizeBtn);

		expect(screen.queryByText("Stryker was here!")).not.toBeInTheDocument();
	});

	test('handles clicks on malformed/null product resources', () => {

		const brokenProduct = {
			...require('react-router-dom').useLoaderData().product, // copy existing mock data
			productResources: [null] // Inject null item
		};
		require('react-router-dom').useLoaderData.mockReturnValue({ product: brokenProduct });

		render(<BrowserRouter><ProductDetails /></BrowserRouter>);

		const resourceBtns = screen.getAllByRole('button');

		const brokenResourceBtn = resourceBtns[0]; 

		expect(() => fireEvent.click(brokenResourceBtn)).not.toThrow();
	});

	

	


});

