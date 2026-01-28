import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      title: 'Home',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '+1 (555) 123-4567',
      default: true,
    },
    {
      id: '2',
      title: 'Office',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      phone: '+1 (555) 123-4568',
      default: false,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleDeleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map(addr => ({
        ...addr,
        default: addr.id === id,
      }))
    );
  };

  const renderAddressCard = ({ item }) => (
    <View style={[styles.addressCard, item.default && styles.defaultCard]}>
      <View style={styles.addressHeader}>
        <View>
          <Text style={styles.addressTitle}>{item.title}</Text>
          {item.default && <Text style={styles.defaultBadge}>Default</Text>}
        </View>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/(tabs)/profile/edit-address',
            params: { id: item.id },
          })}
        >
          <Feather name="edit-2" size={18} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressText}>
        {item.city}, {item.state} {item.zip}
      </Text>
      <Text style={styles.phoneText}>{item.phone}</Text>

      <View style={styles.addressActions}>
        {!item.default && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile/add-address')}>
          <Feather name="plus" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="map-pin" size={48} color="#64748b" />
          <Text style={styles.emptyStateText}>No saved addresses</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/profile/add-address')}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  defaultCard: {
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#6366f1',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  addressText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  setDefaultButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setDefaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginTop: 12,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
