import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { Refeicao } from '../types/data'; 

export default function RefeicaoScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ mealId: string; date: string }>();

  const [refeicao, setRefeicao] = useState<Refeicao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefeicao = async () => {
      const user = auth.currentUser;
      const { mealId, date } = params;

      if (!user || !mealId || !date) {
        Alert.alert("Erro", "Informações insuficientes para carregar a refeição.");
        setLoading(false);
        router.back(); 
        return;
      }

      try {
        const dailyDocRef = doc(db, 'users', user.uid, 'dailyData', date);
        const docSnap = await getDoc(dailyDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const refeicaoCompleta = data.planoCompleto?.refeicoes?.find(
            (r: Refeicao) => r.id === mealId
          );
          
          if (refeicaoCompleta) {
            setRefeicao(refeicaoCompleta);
          } else {
            throw new Error("Refeição não encontrada no plano.");
          }
        } else {
          throw new Error("Plano do dia não encontrado.");
        }
      } catch (error: any) {
        Alert.alert("Erro ao Carregar", error.message);
        router.back(); 
      } finally {
        setLoading(false);
      }
    };

    fetchRefeicao();
  }, [params]);

  const handleMarcarComoConcluido = async () => {
    const user = auth.currentUser;
    const { mealId, date } = params;
    if (!user || !refeicao || !date) return;

    try {
        const dailyDocRef = doc(db, 'users', user.uid, 'dailyData', date);
        const docSnap = await getDoc(dailyDocRef);

        if (!docSnap.exists()) throw new Error("Documento diário não encontrado.");
        
        const dailyData = docSnap.data();
        const mealsSummary = dailyData.meals || [];

        const updatedMealsSummary = mealsSummary.map((meal: any) => 
            meal.id === mealId ? { ...meal, completed: true } : meal
        );

        await updateDoc(dailyDocRef, {
            meals: updatedMealsSummary
        });

        Alert.alert('Sucesso!', `${refeicao.nome} marcada como concluída.`);
        router.back(); 
    } catch (error: any) {
        Alert.alert("Erro", "Não foi possível atualizar o status da refeição.");
    }
  };
  
  if (loading || !refeicao) {
    return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color="#00b06b" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          {/* NAVEGAÇÃO: Seta para voltar para a tela anterior (Home) */}
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refeição</Text>
          <Image source={{ uri: 'https://i.imgur.com/gK9t09y.png' }} style={styles.profileImage} />
        </View>

        <View style={styles.card}>
          <Text style={styles.mealTitle}>{refeicao.nome}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{refeicao.categoria}</Text>
          </View>

          <View style={styles.nutrientsContainer}>
            <View style={styles.nutrientBox}><Text style={styles.nutrientLabel}>Kcal</Text><Text style={styles.nutrientValue}>{refeicao.kcal}</Text></View>
            <View style={styles.nutrientBox}><Text style={styles.nutrientLabel}>Proteínas</Text><Text style={styles.nutrientValue}>{refeicao.proteinas}</Text></View>
            <View style={styles.nutrientBox}><Text style={styles.nutrientLabel}>Carbs</Text><Text style={styles.nutrientValue}>{refeicao.carboidratos}</Text></View>
            <View style={styles.nutrientBox}><Text style={styles.nutrientLabel}>Gorduras</Text><Text style={styles.nutrientValue}>{refeicao.gorduras}</Text></View>
          </View>
          <Text style={styles.editNutrients}>Editar nutrientes</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {refeicao.ingredientes.map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <MaterialIcons name={'check-box'} size={24} color="#44BC7F" />
                <Text style={styles.ingredientText}>{item.texto}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tempo de preparo</Text>
            <Text style={styles.infoValue}>{refeicao.tempoPreparo}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo de preparo</Text>
            {refeicao.modoPreparo.map((passo, index) => (
              <Text key={index} style={styles.stepText}>{`${index + 1}. ${passo}`}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.primaryButton} onPress={handleMarcarComoConcluido}>
        <Text style={styles.primaryButtonText}>Marcar como concluído</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
    scrollView: { paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: 'transparent' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    profileImage: { width: 40, height: 40, borderRadius: 20 },
    card: { backgroundColor: '#FFFFFF', margin: 20, marginTop: 10, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    mealTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    tag: { backgroundColor: '#E0F5E7', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 20 },
    tagText: { color: '#00B06B', fontWeight: '600', fontSize: 12 },
    nutrientsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    nutrientBox: { backgroundColor: '#F7F8FA', borderRadius: 10, padding: 10, alignItems: 'center', width: '23%' },
    nutrientLabel: { fontSize: 12, color: '#6B7280' },
    nutrientValue: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 4 },
    editNutrients: { color: '#6B7280', textDecorationLine: 'underline', fontSize: 12, textAlign: 'center', marginBottom: 20 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    ingredientText: { fontSize: 16, color: '#374151', marginLeft: 10, flex: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F7F8FA', borderRadius: 10, padding: 15, marginTop: 20 },
    infoLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
    infoValue: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
    stepText: { fontSize: 16, color: '#374151', lineHeight: 24, marginBottom: 8 },
    primaryButton: { backgroundColor: '#120D37', borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginHorizontal: 20, marginVertical: 10 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});