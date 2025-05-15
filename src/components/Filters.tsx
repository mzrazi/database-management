import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FiltersProps {
  filters: {
    name: string;
    email: string;
    phone: string;
    hobbies: string[];
    place: string;
    gender: string;
  };
  onChange: (filters: any) => void;
  onClear: () => void;
}

const hobbiesOptions = [
  'Reading', 'Writing', 'Coding', 'Gaming', 
  'Swimming', 'Running', 'Cycling', 'Cooking', 
  'Painting', 'Photography', 'Traveling', 'Music'
];

const placesOptions = [
  'New York', 'Los Angeles', 'Chicago', 'Houston',
  'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
  'Dallas', 'San Jose', 'Austin', 'Jacksonville'
];

const Filters: React.FC<FiltersProps> = ({ filters, onChange, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [hobbiesSearch, setHobbiesSearch] = useState('');
  const [placeSearch, setPlaceSearch] = useState('');
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeApply = () => {
    onChange(localFilters);
  };

  const toggleHobby = (hobby) => {
    setLocalFilters(prev => {
      const hobbies = prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby];
      return { ...prev, hobbies };
    });
  };

  const setPlace = (place) => {
    setLocalFilters(prev => ({ ...prev, place }));
    setPlaceSearch('');
  };

  const filteredHobbies = hobbiesSearch
    ? hobbiesOptions.filter(h => h.toLowerCase().includes(hobbiesSearch.toLowerCase()))
    : hobbiesOptions;

  const filteredPlaces = placeSearch
    ? placesOptions.filter(p => p.toLowerCase().includes(placeSearch.toLowerCase()))
    : placesOptions;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name Filter */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={localFilters.name}
            onChange={handleChange}
            placeholder="Search by name"
            className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email Filter */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={localFilters.email}
            onChange={handleChange}
            placeholder="Search by email"
            className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Filter */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={localFilters.phone}
            onChange={handleChange}
            placeholder="Search by phone"
            className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Gender Filter */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={localFilters.gender}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Place Combo Box */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place
          </label>
          <div className="relative">
            <input
              type="text"
              value={placeSearch}
              onChange={(e) => setPlaceSearch(e.target.value)}
              placeholder="Search place"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {localFilters.place && (
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                  {localFilters.place}
                  <button
                    type="button"
                    onClick={() => setLocalFilters(prev => ({ ...prev, place: '' }))}
                    className="ml-1 flex-shrink-0 inline-flex text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            {placeSearch && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                <ul className="divide-y divide-gray-200">
                  {filteredPlaces.map((place) => (
                    <li
                      key={place}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      onClick={() => setPlace(place)}
                    >
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hobbies Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hobbies
          </label>
          <div className="relative">
            <input
              type="text"
              value={hobbiesSearch}
              onChange={(e) => setHobbiesSearch(e.target.value)}
              placeholder="Search hobbies"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {localFilters.hobbies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {localFilters.hobbies.map((hobby) => (
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
            )}
            {hobbiesSearch && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                <ul className="divide-y divide-gray-200">
                  {filteredHobbies.map((hobby) => (
                    <li
                      key={hobby}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      onClick={() => toggleHobby(hobby)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.hobbies.includes(hobby)}
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 block truncate">{hobby}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={handleChangeApply}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;