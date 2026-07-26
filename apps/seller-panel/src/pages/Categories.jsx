import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerApi } from '../api/sellerApi';
import { FolderTree, Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle, Search, AlertCircle, Upload, Globe } from 'lucide-react';

export const Categories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'ACTIVE',
    sortOrder: 0,
  });

  const [toast, setToast] = useState({ type: '', message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => sellerApi.getCategories(''),
  });

  const categories = data?.data || [];

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  const createMutation = useMutation({
    mutationFn: (data) => sellerApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showToast('success', 'Category created successfully');
      closeModal();
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => sellerApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showToast('success', 'Category updated successfully');
      closeModal();
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => sellerApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      showToast('success', 'Category deleted successfully');
    },
    onError: (err) => {
      showToast('error', err.response?.data?.message || 'Failed to delete category');
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setSelectedFile(null);
    setFormData({ name: '', description: '', image: '', status: 'ACTIVE', sortOrder: 0 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setSelectedFile(null);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'ACTIVE',
      sortOrder: cat.sortOrder || 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setSelectedFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitData;
    if (selectedFile) {
      submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.description) submitData.append('description', formData.description);
      submitData.append('status', formData.status);
      submitData.append('sortOrder', formData.sortOrder);
      submitData.append('image', selectedFile);
    } else {
      submitData = { ...formData };
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-400" /> Categories
          </h1>
          <p className="text-sm text-slate-400 mt-1">Organize your store catalog into product categories</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {toast.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
              : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No categories found. Click "Add Category" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sort Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <FolderTree className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {cat.name}
                      {cat.description && <span className="block text-xs text-slate-500 font-normal mt-0.5">{cat.description}</span>}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cat.status === 'ACTIVE'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cat.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">{cat.sortOrder}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete category '${cat.name}'?`)) {
                              deleteMutation.mutate(cat.id);
                            }
                          }}
                          className="p-2 bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Footwear"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of this category..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Image Input Options */}
              <div className="space-y-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Category Image Options
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Option A: Choose Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0]);
                    }}
                    className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 bg-slate-900 border border-slate-800 rounded-lg p-1"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Option B: Or Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setSelectedFile(null);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
