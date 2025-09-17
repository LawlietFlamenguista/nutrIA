import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { User, onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebaseConfig';

// Tipos e Interfaces
interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
}
type IconName = React.ComponentProps<typeof MaterialIcons>['name'];
type Meal = {
  id: string;
  title: string;
  calories: number;
  lipidios: number;
  carboidratos: number;
  proteinas: number;
  iconName: IconName;
  completed: boolean;
};

// Constantes
const THEME = {
  green: '#00b06b',
  greenLight: '#e0f5e7',
  bg: '#D6E0F3',
  white: '#ffffff',
  gray700: '#374151',
  gray600: '#4b5563',
  gray500: '#6b7280',
  gray300: '#d1d5db',
  gray200: '#e5e7eb',
  indigo900: '#1f2937',
};
const DEFAULT_MEALS: Meal[] = [];
const META_CALORIAS = 2000;
const META_AGUA = 2500;
function formatKey(date: Date) {
  return date.toISOString().split('T')[0];
}
const metrics = ['Calorias', 'Lipídios', 'Carboidratos', 'Proteínas'] as const;


export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [aguaConsumida, setAguaConsumida] = useState(0);
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mlInput, setMlInput] = useState('');
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);

  const todayKey = useMemo(() => formatKey(new Date()), []);
  const isFutureDate = useMemo(() => formatKey(dataAtual) > todayKey, [dataAtual, todayKey]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        }
      } else {
        router.replace('/telasiniciais/login');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const dateKey = formatKey(dataAtual);
    const dailyDocRef = doc(db, 'users', user.uid, 'dailyData', dateKey);

    const unsubscribeFirestore = onSnapshot(dailyDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAguaConsumida(data.agua ?? 0);
        setMeals(data.meals ?? DEFAULT_MEALS);
      } else {
        setAguaConsumida(0);
        setMeals(DEFAULT_MEALS);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao ouvir dados do Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribeFirestore();
  }, [user, dataAtual]);

  const toggleMeal = async (mealId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || isFutureDate) return;

    const dateKey = formatKey(dataAtual);
    const newMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
    );
    setMeals(newMeals);

    try {
      const dailyDocRef = doc(db, 'users', currentUser.uid, 'dailyData', dateKey);
      await updateDoc(dailyDocRef, { meals: newMeals });
    } catch(error) {
      console.error("Erro ao atualizar refeição:", error);
      Alert.alert("Erro", "Não foi possível salvar a alteração.");
      setMeals(meals);
    }
  };
  
  const handleNavigateToRefeicao = (mealId: string) => {
    router.push({
      pathname: '/refeicao',
      params: { 
        mealId: mealId,
        date: formatKey(dataAtual)
      }
    });
  };

  const getMetricValue = (metric: typeof metrics[number]) => {
    return meals.filter(m => m.completed).reduce((sum, m) => {
        switch(metric) {
            case 'Calorias': return sum + m.calories;
            case 'Lipídios': return sum + m.lipidios;
            case 'Carboidratos': return sum + m.carboidratos;
            case 'Proteínas': return sum + m.proteinas;
            default: return sum;
        }
    }, 0);
  };

  const metricMax = (metric: typeof metrics[number]) => {
    switch(metric) {
      case 'Calorias': return META_CALORIAS;
      case 'Lipídios': return 70;
      case 'Carboidratos': return 300;
      case 'Proteínas': return 100;
    }
  };

  const progressoMetric = (metric: typeof metrics[number]) => {
    return Math.min((getMetricValue(metric) / metricMax(metric)) * 100, 100);
  };

  const mudarDia = (delta: number) => {
    const nova = new Date(dataAtual);
    nova.setDate(nova.getDate() + delta);
    setDataAtual(nova);
  };

  const quickAddAgua = async (ml: number) => {
    if (isFutureDate || !user) return;
    const novoTotal = Math.max(0, aguaConsumida + ml);
    const atingiuMetaAgora = aguaConsumida < META_AGUA && novoTotal >= META_AGUA;
    setAguaConsumida(novoTotal);
    
    const dateKey = formatKey(dataAtual);
    const dailyDocRef = doc(db, 'users', user.uid, 'dailyData', dateKey);
    try {
        await setDoc(dailyDocRef, { agua: novoTotal }, { merge: true });
        if (atingiuMetaAgora) {
            Alert.alert('Parabéns!', 'Você atingiu sua meta de hidratação! 🥳💧');
        }
    } catch(error) {
        Alert.alert("Erro", "Não foi possível salvar o consumo de água.");
        setAguaConsumida(aguaConsumida);
    }
  };

  const adicionarAguaCustom = () => {
    const ml = parseInt(mlInput);
    if (!isNaN(ml) && ml > 0) {
      quickAddAgua(ml);
      setMlInput('');
      setModalVisivel(false);
    }
  };

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        setActiveMetricIndex((prev) => (prev + 1) % metrics.length);
      } else if (gestureState.dx > 50) {
        setActiveMetricIndex((prev) => (prev - 1 + metrics.length) % metrics.length);
      }
    },
  }), [activeMetricIndex]);

  const renderMeal = ({ item }: { item: Meal }) => {
    const completed = item.completed;
    const MealComponent = !isFutureDate ? TouchableOpacity : View;
    return (
      <MealComponent
        style={[styles.mealItem, completed && styles.mealItemCompleted]}
        activeOpacity={0.8}
        onPress={() => toggleMeal(item.id)}
        onLongPress={() => handleNavigateToRefeicao(item.id)}
        delayLongPress={200}
      >
        <View style={[styles.mealIconBackground, completed && styles.mealIconBackgroundCompleted]}>
          <MaterialIcons name={item.iconName as IconName} size={22} color={completed ? THEME.white : THEME.gray700} />
        </View>
        <View style={styles.mealInfo}>
          <Text style={[styles.mealTitle, completed && styles.mealTextCompleted]}>{item.title}</Text>
          <Text style={[styles.mealCalories, completed && styles.mealTextCompleted]}>{item.calories} kcal</Text>
        </View>
        <MaterialIcons
          name={completed ? 'check-circle' : 'radio-button-unchecked'}
          size={24}
          color={completed ? THEME.white : THEME.gray500}
        />
      </MealComponent>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={THEME.green} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#44BC7F', '#57CE8E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerCard}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
              <Image source={{ uri: 'https://i.imgur.com/gK9t09y.png' }} style={styles.profileImage} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.hello}>Olá, {userProfile?.nome || 'Usuário'}!</Text>
              <Text style={styles.dateText}>
                {dataAtual.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="notifications" size={22} color={THEME.green} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateNav}>
            <TouchableOpacity onPress={() => mudarDia(-1)} style={styles.dateNavBtn}>
              <MaterialIcons name="chevron-left" size={22} color={THEME.gray700} />
              <Text style={styles.dateNavText}>Ontem</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => setDataAtual(new Date())} style={styles.dateNavCenter}>
              <MaterialIcons name="today" size={18} color={THEME.gray700} />
              <Text style={styles.dateNavToday}>Hoje</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => mudarDia(1)} style={styles.dateNavBtn}>
              <Text style={styles.dateNavText}>Amanhã</Text>
              <MaterialIcons name="chevron-right" size={22} color={THEME.gray700} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCard} {...panResponder.panHandlers}>
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiTitle}>{metrics[activeMetricIndex]}</Text>
              <MaterialIcons name="bar-chart" size={20} color={THEME.green} />
            </View>
            <Text style={styles.kpiValue}>{getMetricValue(metrics[activeMetricIndex])} / {metricMax(metrics[activeMetricIndex])} {activeMetricIndex === 0 ? 'kcal' : 'g'}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressoMetric(metrics[activeMetricIndex])}%` }]} />
            </View>
            <View style={styles.kpiBottomRow}>
              <Text style={styles.kpiHint}>
                Faltam <Text style={styles.kpiHintStrong}>{Math.max(metricMax(metrics[activeMetricIndex]) - getMetricValue(metrics[activeMetricIndex]), 0).toFixed(0)}</Text> {activeMetricIndex === 0 ? 'kcal' : 'g'}
              </Text>
              <Text style={styles.kpiPerc}>{progressoMetric(metrics[activeMetricIndex]).toFixed(0)}%</Text>
            </View>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiTitle}>Água</Text>
              <MaterialIcons name="water-drop" size={20} color={THEME.green} />
            </View>
            <Text style={styles.kpiValue}>{aguaConsumida} / {META_AGUA} ml</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min((aguaConsumida / META_AGUA) * 100, 100)}%` }]} />
            </View>
            {!isFutureDate && (
              <View style={styles.quickRow}>
                {[200, 300, 500].map(ml => (
                  <TouchableOpacity key={ml} style={styles.quickBtn} onPress={() => quickAddAgua(ml)}>
                    <Text style={styles.quickBtnText}>+{ml}ml</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.quickBtn, styles.quickBtnOutline]} onPress={() => setModalVisivel(true)}>
                  <MaterialIcons name="add" size={16} color={THEME.gray700} />
                  <Text style={[styles.quickBtnText, { color: THEME.gray700, marginLeft: 4 }]}>Outro</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas refeições</Text>
          {!isFutureDate && <Text style={styles.sectionSub}>toque para marcar como concluida, segure para visualizar a refeicao</Text>}
        </View>

        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={renderMeal}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </ScrollView>

      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar água (ml)</Text>
            <TextInput
              placeholder="Ex: 180"
              value={mlInput}
              onChangeText={setMlInput}
              keyboardType="numeric"
              style={styles.modalInput}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={adicionarAguaCustom}>
                <Text style={styles.modalBtnTextPrimary}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnGhost]} onPress={() => setModalVisivel(false)}>
                <Text style={styles.modalBtnTextGhost}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.bg },
  scroll: { padding: 16 },
  headerCard: { borderRadius: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileImage: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.white },
  hello: { color: THEME.white, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  dateText: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  iconButton: { backgroundColor: THEME.white, padding: 8, borderRadius: 12 },
  dateNav: { marginTop: 14, backgroundColor: THEME.white, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  dateNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4, flex: 1, justifyContent: 'center' },
  dateNavCenter: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6, backgroundColor: THEME.greenLight, borderRadius: 12 },
  dateNavText: { color: THEME.gray700, fontSize: 13, fontWeight: '600' },
  dateNavToday: { color: THEME.gray700, fontSize: 13, fontWeight: '700' },
  separator: { width: 1, height: 20, backgroundColor: THEME.gray200 },
  kpiRow: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  kpiCard: { flex: 1, backgroundColor: THEME.white, borderRadius: 20, padding: 14, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  kpiTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kpiTitle: { color: THEME.gray600, fontSize: 13, fontWeight: '700' },
  kpiValue: { color: THEME.indigo900, fontSize: 18, fontWeight: '800', marginTop: 6 },
  progressBarBg: { width: '100%', height: 10, backgroundColor: THEME.gray200, borderRadius: 999, marginTop: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: THEME.green, borderRadius: 999 },
  kpiBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  kpiHint: { color: THEME.gray600, fontSize: 12 },
  kpiHintStrong: { fontWeight: '700', color: THEME.gray700 },
  kpiPerc: { color: THEME.gray700, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  quickBtn: { backgroundColor: THEME.green, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  quickBtnText: { color: THEME.white, fontWeight: '700', fontSize: 12 },
  quickBtnOutline: { backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.gray300, flexDirection: 'row', alignItems: 'center' },
  sectionHeader: { marginTop: 6, marginBottom: 10, paddingHorizontal: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { color: THEME.indigo900, fontSize: 18, fontWeight: '800' },
  sectionSub: { color: THEME.gray500, fontSize: 12 },
  mealItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: THEME.white, borderRadius: 16, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  mealItemCompleted: { backgroundColor: THEME.green },
  mealIconBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.greenLight, alignItems: 'center', justifyContent: 'center' },
  mealIconBackgroundCompleted: { backgroundColor: 'rgba(255,255,255,0.25)' },
  mealInfo: { flex: 1 },
  mealTitle: { fontSize: 15, fontWeight: '800', color: THEME.indigo900 },
  mealCalories: { fontSize: 12, color: THEME.gray500, marginTop: 2 },
  mealTextCompleted: { color: THEME.white },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: THEME.white, borderRadius: 18, padding: 16, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: THEME.indigo900, marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: THEME.gray300, borderRadius: 12, padding: 10, marginBottom: 14 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalBtnPrimary: { backgroundColor: THEME.green },
  modalBtnGhost: { backgroundColor: THEME.gray200 },
  modalBtnTextPrimary: { color: THEME.white, fontWeight: '700' },
  modalBtnTextGhost: { color: THEME.gray700, fontWeight: '700' },
});