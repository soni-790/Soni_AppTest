import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>Soni App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <Section title="About">
          Soni App is a simple and modern e-commerce app that helps users shop easily and securely.
        </Section>

        <Section title="Our Mission">
          To provide a smooth, fast, and reliable online shopping experience.
        </Section>

        <Section title="Features">
          ✔ Fast Checkout{'\n'}
          ✔ Secure Payments{'\n'}
          ✔ Product Reviews{'\n'}
          ✔ Quick Delivery
        </Section>

        <Section title="Contact">
          📧 info@soniapp.com{'\n'}
          🌐 www.soniapp.com
        </Section>

        <Text style={styles.footer}>© 2024 Soni App</Text>
      </ScrollView>
    </View>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.text}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: { padding: 20 },
  appName: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  version: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  text: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  footer: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
  },
});
