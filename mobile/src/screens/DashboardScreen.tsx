import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { api } from '../services/api';
import type { Course } from '../utils/types';

export default function DashboardScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard}>
      <View style={styles.courseImagePlaceholder}>
        <Text style={styles.difficultyBadge}>{item.difficultyLevel}</Text>
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.courseDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.enrollButton}
            onPress={() => navigation.navigate('CourseDetails', { course: item })}
          >
            <Text style={styles.enrollButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Courses</Text>
        <Text style={styles.headerSubtitle}>Start your trading journey</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#eab308" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderCourse}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  courseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  courseImagePlaceholder: {
    height: 140,
    backgroundColor: '#334155',
    padding: 12,
    alignItems: 'flex-start',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eab308',
  },
  enrollButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#eab308',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enrollButtonText: {
    color: '#eab308',
    fontWeight: '600',
    fontSize: 14,
  },
});
