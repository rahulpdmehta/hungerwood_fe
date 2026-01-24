import { useNavigate } from 'react-router-dom';

const SpecialItemCard = ({ item }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/menu/${item.id}`);
    };

    return (
        <div
            className="flex flex-col justify-center gap-2 w-28 text-left cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleClick}
        >
            <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-sm border border-white dark:border-gray-800"
                style={{ backgroundImage: `url("${item.image}")` }}
            ></div>
            <p className="text-[#181411] dark:text-gray-200 text-xs font-medium leading-tight">{item.name}</p>
        </div>
    );
};

export default SpecialItemCard;
