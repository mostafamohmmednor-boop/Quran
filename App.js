javascript;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Audio } from 'expo-av';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const BANNER_ID = 'ca-app-pub-2212853504243497/7809798053';
const INTER_ID = 'ca-app-pub-2212853504243497/4203181804';
const interstitial = InterstitialAd.createForAdRequest(INTER_ID);

const surahNames = [
  'الفاتحة',
  'البقرة',
  'آل عمران',
  'النساء',
  'المائدة',
  'الأنعام',
  'الأعراف',
  'الأنفال',
  'التوبة',
  'يونس',
  'هود',
  'يوسف',
  'الرعد',
  'إبراهيم',
  'الحجر',
  'النحل',
  'الإسراء',
  'الكهف',
  'مريم',
  'طه',
  'الأنبياء',
  'الحج',
  'المؤمنون',
  'النور',
  'الفرقان',
  'الشعراء',
  'النمل',
  'القصص',
  'العنكبوت',
  'الروم',
  'لقمان',
  'السجدة',
  'الأحزاب',
  'سبأ',
  'فاطر',
  'يس',
  'الصافات',
  'ص',
  'الزمر',
  'غافر',
  'فصلت',
  'الشورى',
  'الزخرف',
  'الدخان',
  'الجاثية',
  'الأحقاف',
  'محمد',
  'الفتح',
  'الحجرات',
  'ق',
  'الذاريات',
  'الطور',
  'النجم',
  'القمر',
  'الرحمن',
  'الواقعة',
  'الحديد',
  'المجادلة',
  'الحشر',
  'الممتحنة',
  'الصف',
  'الجمعة',
  'المنافقون',
  'التغابن',
  'الطلاق',
  'التحريم',
  'الملك',
  'القلم',
  'الحاقة',
  'المعارج',
  'نوح',
  'الجن',
  'المزمل',
  'المدثر',
  'القيامة',
  'الإنسان',
  'المرسلات',
  'النبأ',
  'النازعات',
  'عبس',
  'التكوير',
  'الانفطار',
  'المطففين',
  'الانشقاق',
  'البروج',
  'الطارق',
  'الأعلى',
  'الغاشية',
  'الفجر',
  'البلد',
  'الشمس',
  'الليل',
  'الضحى',
  'الشرح',
  'التين',
  'العلق',
  'القدر',
  'البينة',
  'الزلزلة',
  'العاديات',
  'القارعة',
  'التكاثر',
  'العصر',
  'الهمزة',
  'الفيل',
  'قريش',
  'الماعون',
  'الكوثر',
  'الكافرون',
  'النصر',
  'المسد',
  'الإخلاص',
  'الفلق',
  'الناس',
];

export default function App() {
  const [sound, setSound] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const sub = interstitial.addAdEventListener(AdEventType.LOADED, () =>
      setAdLoaded(true)
    );
    interstitial.load();
    return () => sub();
  }, []);

  async function playSurah(index) {
    if (adLoaded) {
      try {
        await interstitial.show();
      } catch {}
      setAdLoaded(false);
      interstitial.load();
    }
    if (sound) {
      await sound.unloadAsync();
    }
    setLoading(true);
    setCurrent(index);
    const num = String(index + 1).padStart(3, '0');
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: `https://server8.mp3quran.net/afs/${num}.mp3`,
    });
    setSound(newSound);
    setLoading(false);
    await newSound.playAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>القرآن الكريم كامل - مشاري راشد</Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007A33"
          style={{ marginBottom: 10 }}
        />
      )}
      {current !== null && (
        <Text style={styles.now}>يتم تشغيل سورة {surahNames[current]}</Text>
      )}
      <FlatList
        data={surahNames}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => playSurah(index)}>
            <Text style={styles.itemText}>
              {index + 1}. {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#007A33',
  },
  now: { textAlign: 'center', marginBottom: 8, color: 'blue' },
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemText: { fontSize: 18, textAlign: 'right' },
});
