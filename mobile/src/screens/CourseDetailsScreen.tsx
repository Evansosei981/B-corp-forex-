import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';

export default function CourseDetailsScreen({ route, navigation }: any) {
  const { course } = route.params;

  const handlePurchase = () => {
    Alert.alert(
      'Manual Payment Required',
      'Please transfer the amount to B Corp Account and click Verify.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Verify Payment', onPress: () => Alert.alert('Success', 'Payment submitted for admin verification!') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imagePlaceholder}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.difficulty}>{course.difficultyLevel}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.price}>${course.price.toFixed(2)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.purchaseButtonText}>Buy Now for ${course.price.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: '#1e293b',
    padding: 16,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginTop: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  difficulty: {
    color: '#eab308',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  purchaseButton: {
    backgroundColor: '#eab308',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
