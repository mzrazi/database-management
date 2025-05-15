import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import { createEntry, updateEntry } from '../services/api';
import toast from 'react-hot-toast';

const hobbiesOptions = [
  'Reading', 'Writing', 'Coding', 'Gaming', 
  'Swimming', 'Running', 'Cycling', 'Cooking', 
  'Painting', 'Photography', 'Traveling', 'Music'
];

interface EntryFormProps {
  entryToEdit: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ entryToEdit, onClose, onSuccess }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      hobbies: [],
      place: '',
      gender: ''
    }
  });

  const selectedHobbies = watch('hobbies', []);

  useEffect(() => {
    if (entryToEdit) {
      reset({
        name: entryToEdit.name,
        email: entryToEdit.email,
        phone: entryToEdit.phone,
        hobbies: entryToEdit.hobbies || [],
        place: entryToEdit.place,
        gender: entryToEdit.gender
      });
    }
  }, [entryToEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (entryToEdit) {
        await updateEntry(entryToEdit._id, data);
        toast.success('Entry updated successfully');
      } else {
        await createEntry(data);
        toast.success('Entry created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const toggleHobby = (hobby) => {
    const currentHobbies = [...selectedHobbies];
    const index = currentHobbies.indexOf(hobby);
    
    if (index === -1) {
      setValue('hobbies', [...currentHobbies, hobby]);
    } else {
      currentHobbies.splice(index, 1);
      setValue('hobbies', currentHobbies);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">
          {entryToEdit ? 'Edit Entry' : 'Add New Entry'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: 'Must be a valid Gmail address'
                }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Must be a 10-digit number'
                }
              })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          
          {/* Place Field */}
          <div>
            <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
              Place
            </label>
            <input
              id="place"
              type="text"
              {...register('place', { required: 'Place is required' })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.place && (
              <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
            )}
          </div>
          
          {/* Gender Field */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              {...register('gender', { required: 'Gender is required' })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>
          
          {/* Hobbies Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hobbies
            </label>
            <Controller
              name="hobbies"
              control={control}
              rules={{ 
                required: 'Select at least one hobby',
                validate: (value) => value.length > 0 || 'Select at least one hobby'
              }}
              render={({ field }) => (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedHobbies.map((hobby) => (
                      <span 
                        key={hobby}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {hobby}
                        <button
                          type="button"
                          onClick={() => toggleHobby(hobby)}
                          className="ml-1 flex-shrink-0 inline-flex text-blue-500 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hobbiesOptions.map((hobby) => (
                      <div key={hobby} className="flex items-center">
                        <input
                          id={`hobby-${hobby}`}
                          type="checkbox"
                          checked={selectedHobbies.includes(hobby)}
                          onChange={() => toggleHobby(hobby)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`hobby-${hobby}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {hobby}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
            {errors.hobbies && (
              <p className="mt-1 text-sm text-red-600">{errors.hobbies.message}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : entryToEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;