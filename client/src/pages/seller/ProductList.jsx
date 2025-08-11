import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// --- ICONS ---

const ChevronDownIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const InventoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 21H18a2 2 0 0 0 2-2v-3.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5Z" /><path d="M4 11V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" />
    </svg>
);

const LowStockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3-3-4s-3-2-3-4a7 7 0 0 0-7 7" /><path d="M12 10v4" /><path d="M12 18h.01" />
    </svg>
);

const OutOfStockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
);

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ product, onClose, onConfirm }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Delete Product
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete the product <strong className="font-semibold text-gray-800">{product.name}</strong>? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        Confirm Delete
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProductList = () => {
    const { products, currency, axios, fetchProducts, increaseStock } = useAppContext();
    const [stockInputs, setStockInputs] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [productToDelete, setProductToDelete] = useState(null); // State for confirmation modal

    const { lowStockProducts, outOfStockProducts, inStockProducts } = useMemo(() => {
        const low = products.filter(p => p.stock > 0 && p.stock < 10);
        const out = products.filter(p => p.stock <= 0);
        const inStock = products.filter(p => p.stock >= 10);
        return { lowStockProducts: low, outOfStockProducts: out, inStockProducts: inStock };
    }, [products]);

    const filteredProducts = useMemo(() => {
        switch (filterType) {
            case 'lowStock': return lowStockProducts;
            case 'outOfStock': return outOfStockProducts;
            default: return products;
        }
    }, [products, filterType, lowStockProducts, outOfStockProducts]);

    const productsByCategory = useMemo(() => {
        return filteredProducts.reduce((acc, product) => {
            const originalCategory = product.category || 'Uncategorized';
            const lowerCaseCategory = originalCategory.toLowerCase();
            if (!acc[lowerCaseCategory]) {
                acc[lowerCaseCategory] = { displayName: originalCategory, products: [] };
            }
            acc[lowerCaseCategory].products.push(product);
            return acc;
        }, {});
    }, [filteredProducts]);

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
    
    const handleConfirmDelete = async () => {
        if (productToDelete) {
            await deleteProduct(productToDelete._id);
            setProductToDelete(null); 
        }
    };

    const handleStockChange = (id, value) => setStockInputs({ ...stockInputs, [id]: value });

    const handleIncreaseStock = (id) => {
        const quantity = parseInt(stockInputs[id], 10);
        if (!isNaN(quantity) && quantity > 0) {
            increaseStock(id, quantity);
            setStockInputs({ ...stockInputs, [id]: '' });
        } else {
            toast.error("Please enter a valid quantity.");
        }
    };

    const toggleCategory = (categoryKey) => setActiveCategory(activeCategory === categoryKey ? null : categoryKey);

    const sortedCategoryKeys = useMemo(() => Object.keys(productsByCategory).sort(), [productsByCategory]);

    const pageTitle = {
        all: "Product Inventory",
        lowStock: "Low Stock Items",
        outOfStock: "Out of Stock Items"
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-screen">
            <ConfirmationModal 
                product={productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDelete}
            />

            <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pageTitle[filterType]}
            </h2>

            <div className="space-y-4">
                {sortedCategoryKeys.length > 0 ? sortedCategoryKeys.map((categoryKey) => (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
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
                                                     <button onClick={() => setProductToDelete(product)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-semibold">
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
                )) : (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No products match the current filter.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-700 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Inventory Snapshot
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <SummaryCard
                            icon={<InventoryIcon />} title="All Products" count={products.length}
                            onClick={() => setFilterType('all')} isActive={filterType === 'all'} color="slate"
                        />
                        <SummaryCard
                            icon={<LowStockIcon />} title="Low Stock (<10)" count={lowStockProducts.length}
                            onClick={() => setFilterType('lowStock')} isActive={filterType === 'lowStock'} color="amber"
                        />
                        <SummaryCard
                            icon={<OutOfStockIcon />} title="Out of Stock" count={outOfStockProducts.length}
                            onClick={() => setFilterType('outOfStock')} isActive={filterType === 'outOfStock'} color="rose"
                        />
                    </div>
                    <InventoryDonutChart 
                        data={{
                            inStock: inStockProducts.length,
                            lowStock: lowStockProducts.length,
                            outOfStock: outOfStockProducts.length,
                        }}
                        onSegmentClick={(filter) => setFilterType(filter)}
                    />
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ icon, title, count, onClick, isActive, color }) => {
    const colors = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-800', active: 'bg-slate-600' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-800', active: 'bg-amber-500' },
        rose: { bg: 'bg-rose-100', text: 'text-rose-800', active: 'bg-rose-600' }
    };
    const c = colors[color] || colors.slate;

    return (
        <div onClick={onClick} className={`p-4 rounded-xl flex items-center gap-5 transition-all duration-300 cursor-pointer ${isActive ? `${c.active} text-white shadow-lg` : 'bg-white hover:shadow-md hover:-translate-y-1'}`}>
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${isActive ? 'bg-white/20' : c.bg} ${isActive ? 'text-white' : c.text}`}>
                {icon}
            </div>
            <div>
                <p className={`font-semibold ${isActive ? 'text-white' : 'text-gray-500'}`}>{title}</p>
                <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>{count}</p>
            </div>
        </div>
    );
};

const InventoryDonutChart = ({ data, onSegmentClick }) => {
    const { inStock, lowStock, outOfStock } = data;
    const total = inStock + lowStock + outOfStock;

    if (total === 0) {
        return <div className="flex items-center justify-center h-full bg-white rounded-xl p-6 text-gray-500">No inventory data to display.</div>;
    }

    const segments = [
        { value: inStock, color: "#22c55e", filter: "all", label: "In Stock" },
        { value: lowStock, color: "#f59e0b", filter: "lowStock", label: "Low Stock" },
        { value: outOfStock, color: "#ef4444", filter: "outOfStock", label: "Out of Stock" }
    ];

    const radius = 40;
    let startAngle = 0;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-56 h-56">
                <g>
                    {segments.map((segment, index) => {
                        if (segment.value === 0) return null;
                        const percent = (segment.value / total) * 100;
                        const angle = (percent / 100) * 360;
                        const endAngle = startAngle + angle;
                        const pathData = describeArc(50, 50, radius, startAngle, endAngle);
                        startAngle = endAngle;

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="12"
                                className="transition-transform duration-300 ease-in-out transform origin-center hover:scale-105"
                                onClick={() => onSegmentClick(segment.filter)}
                                style={{ cursor: 'pointer' }}
                            >
                                <title>{`${segment.label}: ${segment.value} (${percent.toFixed(1)}%)`}</title>
                            </path>
                        );
                    })}
                </g>
                <text x="50" y="55" textAnchor="middle" className="transform rotate-0 origin-center text-2xl font-bold fill-gray-700">
                    {total}
                </text>
                <text x="50" y="68" textAnchor="middle" className="transform rotate-0 origin-center text-xs fill-gray-500">
                    Total
                </text>
            </svg>
            <div className="ml-0 sm:ml-8 mt-4 sm:mt-0 space-y-2 text-sm">
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
                        {segment.label} ({segment.value})
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;