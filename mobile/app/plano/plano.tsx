import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router'; 




export default function PlanoScreen() { 
  const router = useRouter(); 
  

  const features: string[] = [
    'Criação ilimitada de planos',
    'Relatórios mensais de progresso',
    'Escaneie seus produtos',
    'Conecte-se com seus amigos',
    'Lista de compras inteligente',
    'Ganhe recompensas'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/images/folha.png')}
        style={styles.folha}
      />

      <View style={styles.contentWrapper}>
        <View style={styles.textBox}>
          <Text style={styles.titulo}>
            Seu plano alimentar está prontinho!
          </Text>
          <Text style={styles.subtitulo}>
            Assine a Nutria+ para desfrutar de todos os recursos do aplicativo e tenha acesso a planos ilimitados!
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.priceBox}>
            <Text style={styles.planName}>Nutria+</Text>
            <View style={styles.priceRow}>
              <Text style={styles.moeda}>R$</Text>
              <Text style={styles.preco}>31,80</Text>
              <Text style={styles.mes}>/mês</Text>
            </View>
          </View>

          <View style={styles.featureList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.iconCircle}>
                  <Check size={16} color="white" />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>OBTER PLANO</Text>
          </Pressable>


          <Pressable style={styles.trialLink} onPress={() => router.push('/telasiniciais/splash')}>
            <Text style={styles.trialText}>Ou faça um teste gratuito</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  folha: {
    position: 'absolute',
    top: 60,
    left: -130,
    width: 285,
    height: 319,
    opacity: 1,
    transform: [{ rotate: '-12deg' }],
    zIndex: -1,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  textBox: {
    marginBottom: 30,
    marginTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#120D37',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: '#120D37',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    width: '100%',
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  priceBox: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  moeda: {
    fontSize: 16,
    color: '#4B5563',
    marginRight: 2,
    fontWeight: '500',
  },
  preco: {
    fontSize: 42,
    fontWeight: '400',
    color: '#1F2937',
  },
  mes: {
    fontSize: 16,
    color: '#6A6591',
    marginLeft: 2,
    fontWeight: '500',
  },
  featureList: {
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#BBC865',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1B0C45',
  },
  button: {
    backgroundColor: '#A8BA31',
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  trialLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  trialText: {
    fontSize: 14,
    color: '#6A6591',
    textDecorationLine: 'underline',
  },
});