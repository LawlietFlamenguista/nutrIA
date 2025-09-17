import { colors } from '@/constants/colors'
import { Link } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export default function Index() {
  return (
    <View style={styles.container}>
     
      <Image
        source={require('../assets/images/brocolis.png')}
        style={[styles.backgroundImage, styles.topRight]}
      />
      <Image
        source={require('../assets/images/folha.png')}
        style={[styles.backgroundImage, styles.bottomLeft]}
      />

      <Text style={styles.titulo}>Seja bem-vindo a NutrIA!</Text>
      <Text style={styles.subtitulo}>Vamos começar montando o seu primeiro plano alimentar!</Text>
 
      <Image
        source={require('../assets/images/imageminicio.png')}
        style={styles.mainImage}
      />

      <Link href="/step" asChild>
        <Pressable style={styles.botao}>
          <Text style={styles.botaotexto}>Próximo</Text>
        </Pressable>
      </Link>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    position: 'absolute',
    opacity: 1,
    resizeMode: 'contain',
    width: 200,
    height: 200,
  },
  topRight: {
    top: -50,
    right: -50,
  },
  bottomLeft: {
    bottom: 500,
    left: -50,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 65,
  },
  mainImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  botao: {
    width: '100%',
    backgroundColor: colors.green,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  botaotexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
})