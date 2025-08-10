import React, { useState } from 'react';
import { categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// Icon for the upload area
const UploadIcon = () => (
    <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
    </svg>
);

// Icon for removing an image
const CloseIcon = () => (
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [stock, setStock] = useState('100');
    const [isDragging, setIsDragging] = useState(false);

    const { axios } = useAppContext();

    const updateFilesAndPreviews = (newFiles) => {
        setFiles(newFiles);
        const previews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };
    
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        updateFilesAndPreviews(selectedFiles);
    };

    const handleDragEvents = (e, dragging) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e) => {
        handleDragEvents(e, false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        updateFilesAndPreviews(droppedFiles);
    };
    
    const removeImage = (indexToRemove) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);
        updateFilesAndPreviews(newFiles);
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setStock('100');
        setFiles([]);
        setImagePreviews([]);
        document.getElementById('file-upload').value = '';
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (files.length === 0) {
            toast.error("Please upload at least one product image.");
            return;
        }
        try {
            const productData = { name, description: description.split('\n'), category, price, offerPrice, stock };
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            files.forEach(file => formData.append('images', file));

            const { data } = await axios.post('/api/product/add', formData);

            if (data.success) {
                toast.success(data.message);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Add New Product
            </h2>
            <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image Upload */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Images</h3>
                        <label
                            htmlFor="file-upload"
                            onDragEnter={(e) => handleDragEvents(e, true)}
                            onDragLeave={(e) => handleDragEvents(e, false)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadIcon />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP</p>
                            </div>
                            <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                        </label>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md border" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">Product Name</label>
                                <input onChange={(e) => setName(e.target.value)} value={name} id="product-name" type="text" placeholder="e.g. Modern Sofa" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="product-description">Product Description</label>
                                <textarea onChange={(e) => setDescription(e.target.value)} value={description} id="product-description" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Enter key features, one per line"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="category">Category</label>
                                    <select onChange={(e) => setCategory(e.target.value)} value={category} id="category" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                                        <option value="">Select Category</option>
                                        {categories.map((item, index) => (
                                            <option key={index} value={item.path}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="product-stock">Product Stock</label>
                                    <input onChange={(e) => setStock(e.target.value)} value={stock} id="product-stock" type="number" placeholder="e.g. 100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="product-price">Original Price</label>
                                <input onChange={(e) => setPrice(e.target.value)} value={price} id="product-price" type="number" placeholder="e.g. 299.99" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="offer-price">Offer Price</label>
                                <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice} id="offer-price" type="number" placeholder="e.g. 249.99" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        Add Product to Store
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;