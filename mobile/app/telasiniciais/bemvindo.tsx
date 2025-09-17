import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BemVindo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/circulo.png')}
          style={[styles.ellipse, { top: -150, left: -100, width: 628, height: 638, opacity: 0.9 }]}
        />
        <Image
          source={require('../../assets/images/ellipse3.png')}
          style={[styles.ellipse, { top: -60, left: -80, width: 320, height: 320, opacity: 1 }]}
        />
        <Image
          source={require('../../assets/images/ellipse3.png')}
          style={[styles.ellipse, { top: 150, right: -60, width: 280, height: 280, opacity: 1 }]}
        />

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/nutria.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Seja bem-vindo(a) a nutr.IA</Text>
        </View>
      </View>
        
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('../telasiniciais/cadastro')}
        >
          <Text style={styles.primaryButtonText}>Começar Agora</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Já possui uma conta?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('../telasiniciais/login')}>
            Entrar
          </Text>
        </Text>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Conectar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/images/apple.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Conectar com Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  ellipse: { position: 'absolute', borderRadius: 999 },
  logoContainer: { alignItems: 'center', zIndex: 10 },
  logo: { width: 230, height: 140, marginBottom: -30 },
  title: { fontSize: 19.5,  color: '#fff', marginBottom: 8, textAlign: 'center' },
  footer: { padding: 26, backgroundColor: '#f0f0f0' },
  primaryButton: { backgroundColor: '#2f855a', paddingVertical: 14, borderRadius: 50, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { textAlign: 'center', color: '#4a5568', marginBottom: 24 },
  loginLink: { color: '#2f855a', fontWeight: 'bold', textDecorationLine: 'underline' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 44 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#cbd5e0' },
  dividerText: { marginHorizontal: 8, color: '#718096', fontWeight: 'bold' },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#cbd5e0', paddingVertical: 12, borderRadius: 50, backgroundColor: '#fff', marginBottom: 12 },
  socialIcon: { width: 20, height: 20, marginRight: 12 },
  socialText: { color: '#2d3748', fontWeight: '500' },
});
