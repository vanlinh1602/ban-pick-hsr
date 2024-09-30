import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';

type Item = {
  id: string;
  name: string;
  icon?: string;
};

type Props = {
  label?: string;
  options: Item[];
  onChange: (id: string) => void;
};

const SelectSearch = ({ options, onChange, label }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item>();

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredItems = options.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    onChange(item.id.toString());
    setSearchTerm(item.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedItem(undefined);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      ref={selectRef}
      aria-labelledby="select-label"
    >
      {label ? (
        <label
          id="select-label"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {selectedItem?.icon ? (
          <img
            src={selectedItem.icon}
            alt={selectedItem.name}
            className="absolute w-6 h-6 rounded-full inset-x-0 left-1 -top-1/2 flex items-center"
          />
        ) : null}
        <input
          type="text"
          className={`${selectedItem?.icon ? 'pl-10' : ''} w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="select-dropdown"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {selectedItem && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear selection"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
            aria-label="Toggle dropdown"
          >
            <FiChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
      {isOpen && (
        <ul
          id="select-dropdown"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-centeryun px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                  selectedItem && selectedItem.id === item.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="option"
                aria-selected={selectedItem && selectedItem.id === item.id}
              >
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                ) : null}
                {item.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500">No items found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectSearch;
