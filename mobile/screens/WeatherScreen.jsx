// weather-app-mobile/screens/WeatherScreen.jsx
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Keyboard,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import theme from '../theme';
import { getWeather, createRecord } from '../api/api';
import { LocationContext } from '../context/LocationContext';

export default function WeatherScreen({ navigation }) {
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [current, setCurrent]   = useState(null);
  const [stats, setStats]       = useState(null);
  const [forecast, setForecast] = useState([]);
  const [mode, setMode]         = useState('hourly'); // 'hourly' or 'daily'
  const { setCoords, setCurrent: setCtxCurrent } = useContext(LocationContext);

  const handleSearch = async () => {
    const loc = query.trim();
    if (!loc) return;
    Keyboard.dismiss();
    setError('');
    setCurrent(null);
    setStats(null);
    setForecast([]);
    setLoading(true);

    try {
      const data = await getWeather(loc);
      const { lat, lon, name } = data.location;

      // update this screen
      setCurrent({
        name,
        lat,
        lon,
        temp:  data.current.temp_c,
        desc:  data.current.condition.text,
        icon:  `https:${data.current.condition.icon}`,
        feels: data.current.feelslike_c,
      });

      // update global context for map & assistant
      setCtxCurrent({
        name, lat, lon,
        temp:  data.current.temp_c,
        desc:  data.current.condition.text,
        feels: data.current.feelslike_c,
      });
      setCoords({ lat, lon });

      // stats
      setStats({
        wind:     `${data.current.wind_kph} kph`,
        humidity: `${data.current.humidity}%`,
        uv:       data.current.uv,
        rain:     `${data.current.precip_mm} mm`,
      });

      // forecast array of days each with .hour
      setForecast(data.forecast.forecastday);
    } catch (e) {
      setError(e.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!current) return;
    const today = new Date().toISOString().slice(0,10);
    try {
      await createRecord({
        locationName: current.name,
        lat:           current.lat,
        lon:           current.lon,
        startDate:     today,
        endDate:       today,
        notes:         `Weather on ${today}: ${current.desc}, ${Math.round(current.temp)}°C`,
      });
      alert('Saved to history!');
    } catch (e) {
      alert('Failed to save: ' + e.message);
    }
  };

  const formatHour = timeString => timeString.split(' ')[1].slice(0,5);
  const formatDate = dateString => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Search + Drawer Button ── */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuBtn}
        >
          <Feather name="menu" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter city or ZIP…"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.iconBtn}
          disabled={loading || !query.trim()}
        >
          <Feather
            name="search"
            size={24}
            color={query.trim() ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Loading / Error */}
      {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {error   && <Text style={styles.error}>{error}</Text>}

      {/* Main Weather Card */}
      {current && (
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.card}
        >
          <Text style={styles.location}>{current.name}</Text>
          <View style={styles.topRow}>
            <Text style={styles.temp}>{Math.round(current.temp)}°</Text>
            <Image source={{ uri: current.icon }} style={styles.icon} />
          </View>
          <Text style={styles.description}>{current.desc}</Text>
          <Text style={styles.details}>Feels like {Math.round(current.feels)}°</Text>
        </LinearGradient>
      )}

      {/* Stats Grid */}
      {stats && (
        <View style={styles.statsGrid}>
          {[
            { label: 'Wind',     value: stats.wind,     icon: 'weather-windy'       },
            { label: 'Humidity', value: stats.humidity, icon: 'water-percent'       },
            { label: 'Rain',     value: stats.rain,     icon: 'weather-rainy'       },
            { label: 'UV',       value: stats.uv,       icon: 'weather-sunny-alert' },
          ].map((s,i) => (
            <View key={i} style={styles.statCard}>
              <MaterialCommunityIcons name={s.icon} size={20} color={theme.colors.primary} />
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Forecast Card */}
      {forecast.length > 0 && (
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>
            {mode === 'hourly' ? 'Hourly Forecast' : '10-Day Forecast'}
          </Text>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setMode('hourly')}
              style={[styles.toggleBtn, mode==='hourly' && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, mode==='hourly' && styles.toggleTextActive]}>
                Hourly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('daily')}
              style={[styles.toggleBtn, mode==='daily' && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, mode==='daily' && styles.toggleTextActive]}>
                10-Day
              </Text>
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <FlatList
            data={mode==='hourly' ? forecast[0].hour : forecast}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item =>
              mode==='hourly'
                ? item.time_epoch.toString()
                : item.date_epoch.toString()
            }
            renderItem={({ item }) => (
              <View style={mode==='hourly' ? styles.hourCard : styles.dayCard}>
                {mode==='hourly' ? (
                  <>
                    <Text style={styles.cardTime}>{formatHour(item.time)}</Text>
                    <Image source={{ uri:`https:${item.condition.icon}` }} style={styles.cardIcon}/>
                    <Text style={styles.cardTemp}>{Math.round(item.temp_c)}°</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardTime}>{formatDate(item.date)}</Text>
                    <Image source={{ uri:`https:${item.day.condition.icon}` }} style={styles.cardIcon}/>
                    <Text style={styles.cardTemp}>
                      {Math.round(item.day.maxtemp_c)}° / {Math.round(item.day.mintemp_c)}°
                    </Text>
                  </>
                )}
              </View>
            )}
          />

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save to History</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:theme.colors.background, padding:theme.spacing.md },
  searchRow:   { flexDirection:'row', alignItems:'center', marginBottom:theme.spacing.md },
  menuBtn:     { marginRight: theme.spacing.sm },
  input:       { flex:1, backgroundColor:'#fff', borderRadius:theme.radii.sm, padding:theme.spacing.sm, fontSize:theme.fontSizes.md },
  iconBtn:     { marginLeft:theme.spacing.sm, padding:theme.spacing.sm },
  error:       { color:theme.colors.error, marginBottom:theme.spacing.sm },

  card:        {
                 borderRadius:theme.radii.lg,
                 padding:theme.spacing.lg,
                 marginBottom:theme.spacing.md,
                 ...Platform.select({
                   ios:{ shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:8 },
                   android:{ elevation:6 }
                 })
               },
  location:    { color:'#fff', fontSize:theme.fontSizes.xl, marginBottom:theme.spacing.sm, fontWeight:'600' },
  topRow:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  temp:        { color:'#fff', fontSize:theme.fontSizes.xxl, fontWeight:'bold' },
  icon:        { width:48, height:48 },
  description: { color:'#fff', fontSize:theme.fontSizes.md, marginTop:theme.spacing.sm, textTransform:'capitalize' },
  details:     { color:'#fff', fontSize:theme.fontSizes.sm, marginTop:theme.spacing.xs },

  statsGrid:   { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' },
  statCard:    {
                 width:'48%',
                 backgroundColor:theme.colors.cardBackground,
                 borderRadius:theme.radii.sm,
                 padding:theme.spacing.sm,
                 marginBottom:theme.spacing.sm,
                 ...Platform.select({
                   ios:{shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.1,shadowRadius:4},
                   android:{elevation:2}
                 })
               },
  statLabel:   { fontSize:theme.fontSizes.sm, color:theme.colors.textSecondary, marginTop:theme.spacing.xs },
  statValue:   { fontSize:theme.fontSizes.md, color:theme.colors.textPrimary, fontWeight:'600' },

  forecastCard:{
                 backgroundColor:theme.colors.cardBackground,
                 borderRadius:theme.radii.lg,
                 padding:theme.spacing.md,
                 marginTop:theme.spacing.md,
                 ...Platform.select({
                   ios:{shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:6},
                   android:{elevation:4}
                 })
               },
  forecastTitle:{ fontSize:theme.fontSizes.lg, color:theme.colors.textPrimary, marginBottom:theme.spacing.sm, fontWeight:'600' },

  toggleRow:   { flexDirection:'row', alignSelf:'center', marginBottom:theme.spacing.sm },
  toggleBtn:   { paddingVertical:theme.spacing.xs, paddingHorizontal:theme.spacing.md, marginHorizontal:theme.spacing.xs, borderRadius:theme.radii.sm, backgroundColor:'#eee' },
  toggleActive:{ backgroundColor:theme.colors.primary },
  toggleText:  { fontSize:theme.fontSizes.md, color:theme.colors.textSecondary },
  toggleTextActive:{ color:'#fff' },

  hourCard:    { width:80, alignItems:'center', padding:theme.spacing.sm, backgroundColor:theme.colors.cardBackground, borderRadius:theme.radii.sm, marginRight:theme.spacing.sm },
  dayCard:     { width:100,alignItems:'center', padding:theme.spacing.sm, backgroundColor:theme.colors.cardBackground, borderRadius:theme.radii.sm, marginRight:theme.spacing.sm },
  cardTime:    { fontSize:theme.fontSizes.sm, color:theme.colors.textSecondary, marginBottom:theme.spacing.xs },
  cardIcon:    { width:40, height:40, marginBottom:theme.spacing.xs },
  cardTemp:    { fontSize:theme.fontSizes.md, color:theme.colors.textPrimary, fontWeight:'600' },

  saveBtn:     { marginTop:theme.spacing.md, backgroundColor:theme.colors.primary, paddingVertical:theme.spacing.sm, borderRadius:theme.radii.md, alignItems:'center' },
  saveBtnText: { color:'#fff', fontSize:theme.fontSizes.md, fontWeight:'600' },
});
