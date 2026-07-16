import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import type { Course } from '../../utils/types';
import CourseImage from '../../components/common/CourseImage';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.createCourse({
        title,
        description,
        price: parseFloat(price),
        difficultyLevel
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setPrice('');
      setDifficultyLevel('Beginner');
      fetchCourses();
      fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert("Failed to create course: " + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCourse = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove all associated enrollments and payments. This action cannot be undone.`)) {
      try {
        await courseService.deleteCourse(id);
        fetchCourses();
      } catch (err: any) {
        console.error(err);
        alert("Failed to delete course: " + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Course Management</h1>
          <p className="text-sm text-foreground-muted">Create and manage your courses.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gold-500 hover:bg-gold-400 text-background px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-foreground-muted animate-pulse">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-4 text-foreground-muted">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <p className="text-foreground-muted mb-4">You haven't created any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="h-40 bg-background rounded-lg mb-4 overflow-hidden border border-border">
                <CourseImage src={course.thumbnailUrl} alt={course.title} className="w-full h-full" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight line-clamp-1">{course.title}</h3>
              <p className="text-foreground-muted text-xs mb-4 line-clamp-2 flex-1">{course.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                <span className="text-gold-500 font-bold">${course.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Link 
                    to={`/admin/courses/${course.id}`}
                    className="bg-background border border-border hover:bg-surface-hover text-foreground px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                  >
                    Manage
                  </Link>
                  <button 
                    onClick={() => handleDeleteCourse(course.id!, course.title)}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Create New Course</h2>
              <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Course Title</label>
                <input 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-base sm:text-sm transition-colors"
                  placeholder="e.g. Advanced Technical Analysis"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-base sm:text-sm transition-colors"
                  placeholder="What will students learn?"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Price ($)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-base sm:text-sm transition-colors"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Difficulty Level</label>
                <div className="relative">
                  <select 
                    value={difficultyLevel}
                    onChange={e => setDifficultyLevel(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-10 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-base sm:text-sm transition-colors cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-foreground-muted">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-background border border-border hover:bg-surface-hover px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gold-500 hover:bg-gold-400 text-background px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
