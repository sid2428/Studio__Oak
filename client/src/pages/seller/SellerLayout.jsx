import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/admin", icon: assets.add_icon },
        { name: "Product List", path: "/admin/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/seller/logout');
            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error)         {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <Link to='/' style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-stone-800 tracking-wide">
                        Studio Oak
                    </Link>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarLinks.map((item) => (
                            <li key={item.name}>
                                <NavLink 
                                    to={item.path} 
                                    end={item.path === "/admin"}
                                    className={({ isActive }) => 
                                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                            isActive 
                                                ? "bg-primary text-white" 
                                                : "text-gray-600 hover:bg-gray-200"
                                        }`
                                    }
                                >
                                    <img src={item.icon} alt={item.name} className="w-6 h-6" />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 p-4 flex justify-end items-center">
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;