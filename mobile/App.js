// App.js
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer }     from '@react-navigation/native';
import { createDrawerNavigator }    from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient }           from 'expo-linear-gradient';
import { Feather }                  from '@expo/vector-icons';

import WeatherScreen    from './screens/WeatherScreen';
import MapScreen        from './screens/MapScreen';
import HistoryScreen    from './screens/HistoryScreen';
import AssistantScreen  from './screens/AssistantScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import theme            from './theme';

const Tab = createBottomTabNavigator();
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // ← no headers on tabs
        tabBarActiveTintColor:   theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle:             { backgroundColor: theme.colors.cardBackground },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Weather:   'sun',
            Map:       'map',
            History:   'clock',
            Assistant: 'message-circle'
          };
          return <Feather name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Weather"   component={WeatherScreen} />
      <Tab.Screen name="Map"       component={MapScreen} />
      <Tab.Screen name="History"   component={HistoryScreen} />
      <Tab.Screen name="Assistant" component={AssistantScreen} />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.gradient}
        >
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={props => <CustomDrawerContent {...props} />}
              screenOptions={{ headerShown: false }}  
            >
              <Drawer.Screen name="Home" component={BottomTabs} />
            </Drawer.Navigator>
          </NavigationContainer>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.primary },
  gradient: { flex: 1 },
});
