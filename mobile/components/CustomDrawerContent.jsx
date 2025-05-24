// mobile/components/CustomDrawerContent.jsx
import React from 'react'
import {
  View,
  Text,
  Image,
  Linking,
  StyleSheet
} from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer'
import { Feather } from '@expo/vector-icons'
import theme from '../theme'

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Profile Header (no background color now) */}
      <View style={styles.header}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>PM ACCELERATOR</Text>
          
        </View>
      </View>

      {/* PM Accelerator Link + Description */}
      <View style={styles.linkSection}>
        <DrawerItem
          label="About PM Accelerator"
          onPress={() =>
            Linking.openURL('https://www.linkedin.com/school/pmaccelerator/')
          }
          icon={({ color, size }) => (
            <Feather name="link" size={size} color={color} />
          )}
          labelStyle={styles.drawerLabel}
        />
        <Text style={styles.description}>
          The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.
        </Text>
      </View>

      {/* The rest of your drawer items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    // backgroundColor removed
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  name: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  linkSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  drawerLabel: {
    fontSize: theme.fontSizes.md,
    marginLeft: -16,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    lineHeight: theme.fontSizes.sm * 1.5,
  },
})
