const DietToggle = ({ value, onChange }) => {
    return (
        <div className="flex px-4 py-4">
            <div className="flex h-10 w-full items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800 p-0.5 border-2 border-gray-300 dark:border-gray-700 shadow-sm">
                {/* <label
                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${value === 'All'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-black'
                        : 'text-gray-500'
                        } text-sm font-bold leading-normal transition-all`}
                >
                    <span className="flex items-center gap-1.5">
                        All
                    </span>
                    <input
                        type="radio"
                        name="diet-filter"
                        value="All"
                        checked={value === 'All'}
                        onChange={(e) => onChange(e.target.value)}
                        className="invisible w-0"
                    />
                </label> */}
                <label
                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${value === 'Veg'
                        ? 'bg-white dark:bg-gray-700 shadow-md border border-green-200 dark:border-green-700 text-green-600'
                        : 'text-gray-500'
                        } text-sm font-bold leading-normal transition-all`}
                >
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Veg
                    </span>
                    <input
                        type="radio"
                        name="diet-filter"
                        value="Veg"
                        checked={value === 'Veg'}
                        onChange={(e) => onChange(e.target.value)}
                        className="invisible w-0"
                    />
                </label>
                <label
                    className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 ${value === 'Non-Veg'
                        ? 'bg-white dark:bg-gray-700 shadow-md border border-red-200 dark:border-red-700 text-red-600'
                        : 'text-gray-500'
                        } text-sm font-bold leading-normal transition-all`}
                >
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Non-Veg
                    </span>
                    <input
                        type="radio"
                        name="diet-filter"
                        value="Non-Veg"
                        checked={value === 'Non-Veg'}
                        onChange={(e) => onChange(e.target.value)}
                        className="invisible w-0"
                    />
                </label>
            </div>
        </div>
    );
};

export default DietToggle;
