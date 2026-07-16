import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';

interface Lesson {
  id?: number;
  title: string;
  videoUrl: string;
  orderIndex: number;
}

interface Module {
  id?: number;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export default function AdminCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);
      
      const modulesRes = await api.get(`/courses/${id}/modules`);
      
      // Fetch lessons for each module
      const modulesData = await Promise.all(
        modulesRes.data.map(async (mod: any) => {
          const lessonsRes = await api.get(`/courses/modules/${mod.id}/lessons`);
          return { ...mod, lessons: lessonsRes.data };
        })
      );
      
      setModules(modulesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/modules`, {
        title: moduleTitle,
        orderIndex: modules.length
      });
      setShowModuleModal(false);
      setModuleTitle('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;
    
    // Auto-convert standard youtube links to embed links if needed
    let finalUrl = videoUrl;
    if (finalUrl.includes('watch?v=')) {
      finalUrl = finalUrl.replace('watch?v=', 'embed/');
    }

    const currentModule = modules.find(m => m.id === selectedModuleId);
    
    try {
      await api.post(`/courses/modules/${selectedModuleId}/lessons`, {
        title: lessonTitle,
        videoUrl: finalUrl,
        orderIndex: currentModule?.lessons.length || 0,
        isFreePreview: false
      });
      setShowLessonModal(false);
      setLessonTitle('');
      setVideoUrl('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading course...</div>;
  if (!course) return <div className="p-8 text-white">Course not found.</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title} - Curriculum</h1>
        <p className="text-slate-400">Build your course curriculum by adding Modules and YouTube lessons.</p>
      </div>

      <div className="mb-8">
        <button 
          onClick={() => setShowModuleModal(true)}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium border border-white/10 transition-colors"
        >
          + Add New Module
        </button>
      </div>

      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-slate-400">
            No modules created yet. Start by adding a module (e.g. "Week 1: Introduction").
          </div>
        ) : (
          modules.map(module => (
            <div key={module.id} className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-slate-900/50 p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Module {module.orderIndex + 1}: {module.title}</h3>
                <button 
                  onClick={() => { setSelectedModuleId(module.id!); setShowLessonModal(true); }}
                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add YouTube Lesson
                </button>
              </div>
              
              <div className="p-4 space-y-2">
                {module.lessons.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No lessons in this module yet.</p>
                ) : (
                  module.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-lg border border-white/5">
                      <div className="text-slate-500 font-mono text-sm">{idx + 1}.</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{lesson.title}</div>
                        <div className="text-xs text-blue-400 truncate max-w-md">{lesson.videoUrl}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-white">Add Module</h2>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Module Title</label>
                <input 
                  required
                  value={moduleTitle}
                  onChange={e => setModuleTitle(e.target.value)}
                  placeholder="e.g. Week 1: Market Fundamentals"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModuleModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl font-medium transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-white">Add YouTube Lesson</h2>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Lesson Title</label>
                <input 
                  required
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">YouTube URL</label>
                <input 
                  required
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowLessonModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl font-medium transition-colors">Add Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
