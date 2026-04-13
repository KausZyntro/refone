import React from 'react';
import { Address } from '../../types/address';
import { MdLocationOn, MdEdit, MdDelete, MdHome, MdWork } from 'react-icons/md';

interface AddressCardProps {
    address: Address;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}
// interface AddressCardProps {
//     address: Address;
//     onEdit: (address: Address) => void;
//     onDelete: (id: number) => void;
// }

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete }) => {
    // const getIcon = () => {
    //     switch (address.type) {
    //         case 'Home':
    //             return <MdHome size={20} />;
    //         case 'Office':
    //             return <MdWork size={20} />;
    //         default:
    //             return <MdLocationOn size={20} />;
    //     }
    // };
    console.log(address.name)
    return (
        <div className="address-card">
            {/* <div className="card-header">
                <span className="tag-type">
                    {getIcon()}
                    {address.type}
                </span>
            </div> */}

            <div className="card-body">
                <p>{address.name}</p>
                <p className="city-state">
                    {address.city}, {address.state}
                </p>
                <p>{address.address_line1}, {address.city}, {address.state}, {address.pincode}</p>
            </div>

            <div className="card-actions">
                <button
                    onClick={() => onEdit(address.id)}
                    className="action-btn edit-btn"
                >
                    <MdEdit size={18} /> Edit
                </button>
                <div className="action-divider" />
                <button
                    onClick={() => onDelete(address.id)}
                    className="action-btn delete-btn"
                >
                    <MdDelete size={18} /> Delete
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
