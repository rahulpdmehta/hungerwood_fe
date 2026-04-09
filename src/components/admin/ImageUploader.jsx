/**
 * Image Uploader Component
 * Supports both URL input and file upload
 */

import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ value, onChange, label = 'Image' }) => {
  const [mode, setMode] = useState('url'); // 'url' | 'upload'
  const [imageUrl, setImageUrl] = useState(value || '');
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onChange(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setPreviewUrl('');
    setUploadedFile(null);
    onChange('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'url'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon size={16} className="inline mr-2" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'upload'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload size={16} className="inline mr-2" />
          Upload
        </button>
      </div>

      {/* URL Input */}
      {mode === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">
            Enter a valid image URL (JPG, PNG, WebP)
          </p>
        </div>
      )}

      {/* File Upload */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">JPG, PNG or WebP (MAX. 2MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {uploadedFile && (
            <p className="text-sm text-gray-600">
              Selected: {uploadedFile.name}
            </p>
          )}
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
              }}
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
