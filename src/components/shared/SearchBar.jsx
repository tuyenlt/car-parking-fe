import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SearchBar({
  placeholder = 'Search...',
  onSubmit,
  onChange,
  notSubmit,
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-3 w-full max-w-md"
    >
      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-grow ">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="bg-transparent focus:outline-none text-sm text-gray-700 w-full placeholder:text-gray-500"
        />
      </div>
      {notSubmit ? null : (
        <Button variant="outline" className="font-normal">
          Submit
        </Button>
      )}
    </form>
  );
}
