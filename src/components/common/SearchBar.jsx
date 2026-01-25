const SearchBar = ({ isOpen, value, onChange, placeholder = 'Search for dishes...' }) => {
    if (!isOpen) return null;

    return (
        <div className="bg-white dark:bg-[#211811] border-b border-gray-100 dark:border-gray-800 px-4 py-3 animate-slideDown">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    className="w-full px-4 py-2 pl-10 pr-4 border-2 border-[#543918]/20 rounded-xl bg-[#f8f7f6] dark:bg-[#211811] text-[#181411] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#543918] transition-colors"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    search
                </span>
            </div>
        </div>
    );
};

export default SearchBar;
