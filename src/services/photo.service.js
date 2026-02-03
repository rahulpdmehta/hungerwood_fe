/**
 * Photo Service
 * API calls for photo library (public)
 */

import api from './api';

// Helper to transform _id to id for photos
const transformPhoto = (photo) => {
  if (!photo) return photo;
  const { _id, ...rest } = photo;
  return {
    ...rest,
    id: _id || photo.id,
  };
};

const transformPhotos = (photos) => {
  if (!Array.isArray(photos)) return photos;
  return photos.map(transformPhoto);
};

export const photoService = {
  // Get all active photos (public)
  getActivePhotos: async () => {
    const response = await api.get('/photos');
    if (response.data) {
      response.data = transformPhotos(response.data);
    }
    return response.data;
  }
};

export default photoService;
