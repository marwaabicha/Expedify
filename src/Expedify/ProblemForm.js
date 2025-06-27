import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertTriangle, FiCheckCircle, FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProblemForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    urgency: 'medium',
    attachments: []
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [charCount, setCharCount] = useState(0);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { value: 'technical', label: 'Problème technique', icon: '🛠️' },
    { value: 'billing', label: 'Facturation', icon: '💳' },
    { value: 'service', label: 'Service client', icon: '👨‍💼' },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: '✨' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Peu urgent', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Urgent', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Critique', color: 'bg-red-100 text-red-800' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'description') {
      setCharCount(value.length);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter(file =>
      file.size <= 5 * 1024 * 1024 &&
      ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
    ).slice(0, 3 - formData.attachments.length);

    const newPreviews = validFiles.map(file => ({
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null
    }));

    setPreviewFiles(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setPreviewFiles(prev => {
      const toRemove = prev[index];
      if (toRemove?.preview) URL.revokeObjectURL(toRemove.preview);
      return prev.filter((_, i) => i !== index);
    });

    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('category', formData.category);
      formPayload.append('urgency', formData.urgency);

      formData.attachments.forEach(file => {
        formPayload.append('attachments', file);
      });

      await axios.post('http://localhost:8000/api/problems', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus({ submitting: false, success: true, error: null });
      
      // Afficher un message de succès plus élaboré
      setTimeout(() => {
        resetForm();
        navigate('/'); // Redirection vers la page d'accueil après 2 secondes
      }, 2000);
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: error.response?.data?.message || 'Une erreur est survenue.'
      });
    }
  };

  const resetForm = () => {
    previewFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });

    setFormData({
      title: '',
      description: '',
      category: 'technical',
      urgency: 'medium',
      attachments: []
    });
    setPreviewFiles([]);
    setCharCount(0);
  };

  useEffect(() => {
    return () => {
      previewFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [previewFiles]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <FiAlertTriangle className="text-2xl text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Signaler un problème</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du problème *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Décrivez brièvement le problème"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'urgence *</label>
            <div className="flex space-x-2">
              {urgencyLevels.map(level => (
                <label
                  key={level.value}
                  className={`flex-1 text-center py-2 px-3 rounded-lg cursor-pointer border transition-all ${formData.urgency === level.value ? `${level.color} border-transparent font-medium` : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={level.value}
                    checked={formData.urgency === level.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {level.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Description détaillée *</label>
            <span className={`text-xs ${charCount > 500 ? 'text-red-500' : 'text-gray-500'}`}>{charCount}/500 caractères</span>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            maxLength={500}
            placeholder="Décrivez le problème en détail..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièces jointes (max 3)</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} transition-colors`}
          >
            <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:underline flex flex-col items-center">
              <FiUpload className="text-2xl mb-2" />
              Cliquez ou glissez-déposez vos fichiers ici
            </label>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewFiles.map((file, index) => (
              <div key={index} className="relative border rounded p-2 flex items-center">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="h-16 w-16 object-cover rounded" />
                ) : (
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={status.submitting}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
        >
          {status.submitting ? 'Envoi en cours...' : 'Envoyer le problème'}
        </button>
        {status.success && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg flex items-center animate-fade-in">
            <FiCheckCircle className="mr-2 text-xl" />
            <div>
              <span className="font-bold">Succès !</span> Votre problème a été soumis avec succès. 
              <br />Vous serez redirigé vers la page d'accueil dans quelques instants...
            </div>
          </div>
        )}
        {status.error && (
          <div className="text-red-600 text-sm mt-2 flex items-center">
            <FiAlertTriangle className="mr-1" /> {status.error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProblemForm;