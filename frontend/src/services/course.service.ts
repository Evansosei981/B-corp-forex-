import { api } from './api';
import type { Course } from '../utils/types';

export const courseService = {
  getAllCourses: async () => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },
  
  createCourse: async (course: Course) => {
    const response = await api.post<Course>('/courses', course);
    return response.data;
  },
  
  deleteCourse: async (id: number) => {
    await api.delete(`/courses/${id}`);
  },
  
  toggleWishlist: async (id: number) => {
    await api.post(`/wishlists/${id}/toggle`);
  },
  
  getWishlist: async () => {
    const response = await api.get<Course[]>('/wishlists');
    return response.data;
  }
};
