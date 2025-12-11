import { Menu, X, FileText, Lock, Unlock, Globe } from "lucide-react";
import { useState } from "react";

const HamburgerMenu = ({ activeFilter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "all", label: "All", icon: Globe },
    { id: "public", label: "Public Files", icon: Unlock },
    { id: "private", label: "Private Files", icon: Lock },
  ];

  const handleFilterClick = (filterId) => {
    onFilterChange(filterId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:block
        `}
      >
        <div className="p-6 pt-20 lg:pt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Files
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleFilterClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                    ${
                      activeFilter === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default HamburgerMenu;
