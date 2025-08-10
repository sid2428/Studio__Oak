import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// Icon for the accordion toggle
const ChevronDownIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const ProductList = () => {
    const { products, currency, axios, fetchProducts, increaseStock } = useAppContext();
    const [stockInputs, setStockInputs] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    // Group products by category case-insensitively
    const productsByCategory = useMemo(() => {
        return products.reduce((acc, product) => {
            const originalCategory = product.category || 'Uncategorized';
            const lowerCaseCategory = originalCategory.toLowerCase(); // Use lowercase for grouping key

            if (!acc[lowerCaseCategory]) {
                acc[lowerCaseCategory] = {
                    displayName: originalCategory, // Store the first-seen casing for display
                    products: []
                };
            }
            acc[lowerCaseCategory].products.push(product);
            return acc;
        }, {});
    }, [products]);

    const deleteProduct = async (id) => {
        try {
            const { data } = await axios.post('/api/product/delete', { id });
            if (data.success) {
                fetchProducts();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleStockChange = (id, value) => {
        setStockInputs({ ...stockInputs, [id]: value });
    };

    const handleIncreaseStock = (id) => {
        const quantity = parseInt(stockInputs[id], 10);
        if (!isNaN(quantity) && quantity > 0) {
            increaseStock(id, quantity);
            setStockInputs({ ...stockInputs, [id]: '' });
        } else {
            toast.error("Please enter a valid quantity.");
        }
    };

    const toggleCategory = (categoryKey) => {
        setActiveCategory(activeCategory === categoryKey ? null : categoryKey);
    };
    
    // Get sorted category keys
    const sortedCategoryKeys = useMemo(() => Object.keys(productsByCategory).sort(), [productsByCategory]);

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Product Inventory
            </h2>

            <div className="space-y-4">
                {sortedCategoryKeys.map((categoryKey) => (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(categoryKey)}
                            className={`w-full flex justify-between items-center p-4 text-left transition-colors duration-300 ${activeCategory === categoryKey ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <h3 className="text-xl font-semibold capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {productsByCategory[categoryKey].displayName}
                                <span className="ml-3 text-sm font-normal">({productsByCategory[categoryKey].products.length} items)</span>
                            </h3>
                            <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${activeCategory === categoryKey ? 'transform rotate-180' : ''}`} />
                        </button>

                        {/* Collapsible Product Table */}
                        {activeCategory === categoryKey && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manage Stock</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {productsByCategory[categoryKey].products.map((product) => (
                                            <tr key={product._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img className="h-12 w-12 rounded-md object-cover" src={product.image[0]} alt={product.name} />
                                                        <div className="ml-4 font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{currency}{product.offerPrice}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{product.stock}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={stockInputs[product._id] || ''}
                                                            onChange={(e) => handleStockChange(product._id, e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                                            placeholder="Add"
                                                        />
                                                        <button onClick={() => handleIncreaseStock(product._id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs font-semibold">
                                                            Update
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button onClick={() => deleteProduct(product._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-semibold">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;