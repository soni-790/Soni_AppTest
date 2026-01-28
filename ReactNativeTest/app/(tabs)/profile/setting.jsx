import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    orders: true,
    promotions: true,
  });
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    Alert.alert('Success', `Theme changed to ${newTheme}`);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    Alert.alert('Success', `Language changed to ${lang === 'en' ? 'English' : 'Urdu'}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingToggleItem
            icon="bell"
            label="Push Notifications"
            value={notifications.push}
            onToggle={() => toggleNotification('push')}
          />
          <SettingToggleItem
            icon="mail"
            label="Email Notifications"
            value={notifications.email}
            onToggle={() => toggleNotification('email')}
          />
          <SettingToggleItem
            icon="message-square"
            label="SMS Notifications"
            value={notifications.sms}
            onToggle={() => toggleNotification('sms')}
          />
          <SettingToggleItem
            icon="package"
            label="Order Updates"
            value={notifications.orders}
            onToggle={() => toggleNotification('orders')}
          />
          <SettingToggleItem
            icon="gift"
            label="Promotional Offers"
            value={notifications.promotions}
            onToggle={() => toggleNotification('promotions')}
          />
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Feather name="moon" size={18} color="#6366f1" />
              <View style={{ flex: 1 }}>
                <Text style={styles.labelText}>Theme</Text>
                <Text style={styles.sublabelText}>Dark mode is currently enabled</Text>
              </View>
            </View>
          </View>

          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'light' && styles.themeButtonActive,
              ]}
              onPress={() => changeTheme('light')}
            >
              <Feather name="sun" size={16} color={theme === 'light' ? '#fff' : '#94a3b8'} />
              <Text style={[
                styles.themeButtonText,
                theme === 'light' && styles.themeButtonTextActive,
              ]}>
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'dark' && styles.themeButtonActive,
              ]}
              onPress={() => changeTheme('dark')}
            >
              <Feather name="moon" size={16} color={theme === 'dark' ? '#fff' : '#94a3b8'} />
              <Text style={[
                styles.themeButtonText,
                theme === 'dark' && styles.themeButtonTextActive,
              ]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>

          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}>
                English
              </Text>
              {language === 'en' && <Feather name="check" size={16} color="#fff" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'ur' && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage('ur')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'ur' && styles.languageButtonTextActive,
              ]}>
                Urdu
              </Text>
              {language === 'ur' && <Feather name="check" size={16} color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function SettingToggleItem({ icon, label, value, onToggle }) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLabel}>
        <Feather name={icon} size={18} color="#6366f1" />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#334155', true: '#6366f1' }}
        thumbColor={value ? '#fff' : '#cbd5e1'}
      />
    </View>
  );
}

function SettingItemWithArrow({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLabel}>
        <Feather name={icon} size={18} color="#6366f1" />
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="#64748b" />
    </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  labelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  sublabelText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  themeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  languageOptions: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  bottomSpace: {
    height: 40,
  },
});
