import { Search } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function QuizFilters({ 
  searchTerm, 
  setSearchTerm, 
  filterClass, 
  setFilterClass, 
  filterSubject, 
  setFilterSubject,
  classes,
  subjects
}) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="col-span-2">
        <Input
          type="text"
          theme="dark"
          placeholder="Search quizzes..."
          startIcon={<Search className="w-5 h-5 text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="col-span-1">
        <Select
          value={filterClass}
          onChange={(value) => setFilterClass(value)}
          options={[
            { value: 'all', label: 'All Classes' },
            ...classes.map(c => ({
              value: c.id,
              label: c.title
            }))
          ]}
          placeholder="Filter by Class"
        />
      </div>
      <div className="col-span-1">
        <Select
          value={filterSubject}
          onChange={(value) => setFilterSubject(value)}
          options={[
            { value: 'all', label: 'All Subjects' },
            ...subjects.map(s => ({
              value: s.id,
              label: s.name
            }))
          ]}
          placeholder="Filter by Subject"
        />
      </div>
    </div>
  );
}