import api from './api';

// Helper to transform _id to id for frontend consistency
const transformAddress = (address) => {
  if (!address) return address;
  return {
    ...address,
    id: address._id || address.id,
  };
};

const transformAddresses = (addresses) => {
  if (!Array.isArray(addresses)) return addresses;
  return addresses.map(transformAddress);
};

export const addressService = {
  // Get all addresses
  getAddresses: async () => {
    const response = await api.get('/addresses');
    if (response.data) {
      response.data = transformAddresses(response.data);
    }
    return response;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    if (response.data) {
      response.data = transformAddress(response.data);
    }
    return response;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    if (response.data) {
      response.data = transformAddress(response.data);
    }
    return response;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response;
  },

  // Set default address
  setDefaultAddress: async (id) => {
    const response = await api.patch(`/addresses/${id}/default`);
    if (response.data) {
      response.data = transformAddress(response.data);
    }
    return response;
  },
};

export default addressService;
