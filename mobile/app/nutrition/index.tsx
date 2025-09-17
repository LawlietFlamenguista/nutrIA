import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { colors } from '../../constants/colors';
import { api } from '../../services/api';
import { useDataStore } from '../../store/data';
import { Data, Refeicao } from '../../types/data'; 
import { useEffect } from 'react';

import { auth, db } from '../firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';

interface ResponseData {
  data: Data;
}


type MealSummary = {
  id: string;
  title: string;
  calories: number;
  lipidios: number;
  carboidratos: number;
  proteinas: number;
  iconName: string; 
  completed: boolean;
};

export default function Nutrition() {
  const userStore = useDataStore((state) => state.user);
  const setPlan = useDataStore((state) => state.setPlan);

  const { isFetching, error } = useQuery({

    queryKey: ['nutritionPlan', auth.currentUser?.uid], 
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!userStore || !currentUser) {
        Alert.alert("Erro de Sessão", "Não foi possível identificar o usuário. Por favor, reinicie o aplicativo.");
        router.replace('/');
        throw new Error('Usuário não autenticado ou dados do formulário ausentes.');
      }

      try {

        const response = await api.post<ResponseData>('/create', {
          name: userStore.name,
          age: userStore.age,
          gender: userStore.gender,
          height: userStore.height,
          weight: userStore.weight,
          objective: userStore.objective,
          level: userStore.level,
        });

        const planoGerado = response.data.data;
        if (!planoGerado || !planoGerado.refeicoes) {
          throw new Error("A resposta da IA não continha um plano válido.");
        }


        const dateKey = new Date().toISOString().split('T')[0];
        const dailyDocRef = doc(db, 'users', currentUser.uid, 'dailyData', dateKey);


        const mealsResumo: MealSummary[] = planoGerado.refeicoes.map((refeicao: Refeicao) => ({
          id: refeicao.id,
          title: refeicao.nome,
          calories: refeicao.kcal,
          lipidios: refeicao.gorduras,
          carboidratos: refeicao.carboidratos,
          proteinas: refeicao.proteinas,
          iconName: 'fastfood', 
          completed: false,
        }));
        
        await setDoc(dailyDocRef, {
          planoCompleto: planoGerado,
          meals: mealsResumo,
        }, { merge: true });


        setPlan(planoGerado);
        

        router.replace('/plano/plano');

        return planoGerado;

      } catch (err) {
        console.error("Erro no fluxo de nutrição:", err);
        Alert.alert("Erro", "Falha ao gerar ou salvar sua dieta. Por favor, tente novamente.");
        router.replace('/');
        throw err;
      }
    },

    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!userStore, 
  });


  if (isFetching) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Estamos gerando sua dieta!</Text>
        <Text style={styles.loadingText}>Consultando IA...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Falha ao gerar dieta!</Text>
        <Link href="/">
          <Text style={styles.loadingText}>Tente novamente</Text>
        </Link>
      </View>
    );
  }

  return null; 
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'rgba(208, 208, 208, 0.40)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 4,
    color: '#120D37',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});