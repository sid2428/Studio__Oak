import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [stock, setStock] = useState('');

    const { axios } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice,
                stock
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const { data } = await axios.post('/api/product/add', formData);

            if (data.success) {
                toast.success(data.message);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setStock('');
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
            <form onSubmit={onSubmitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="grid grid-cols-4 gap-4">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                <input 
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                    type="file" 
                                    id={`image${index}`} 
                                    hidden 
                                />
                                <img 
                                    className="w-full h-32 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-primary" 
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} 
                                    alt="upload" 
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">Product Name</label>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                        id="product-name" 
                        type="text" 
                        placeholder="e.g. Modern Sofa" 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                        required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="product-description">Product Description</label>
                    <textarea 
                        onChange={(e) => setDescription(e.target.value)} 
                        value={description}
                        id="product-description" 
                        rows={4} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                        placeholder="Enter product details"
                    ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="category">Category</label>
                        <select 
                            onChange={(e) => setCategory(e.target.value)} 
                            value={category} 
                            id="category" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item.path}>{item.text}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="product-stock">Product Stock</label>
                        <input 
                            onChange={(e) => setStock(e.target.value)} 
                            value={stock} 
                            id="product-stock" 
                            type="number" 
                            placeholder="e.g. 100" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            required 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="product-price">Product Price</label>
                        <input 
                            onChange={(e) => setPrice(e.target.value)} 
                            value={price}
                            id="product-price" 
                            type="number" 
                            placeholder="e.g. 299.99" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="offer-price">Offer Price</label>
                        <input 
                            onChange={(e) => setOfferPrice(e.target.value)} 
                            value={offerPrice} 
                            id="offer-price" 
                            type="number" 
                            placeholder="e.g. 249.99" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;