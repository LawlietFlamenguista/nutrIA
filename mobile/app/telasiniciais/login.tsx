

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const { width, height } = Dimensions.get('window');

const googleLogo = 'https://img.icons8.com/color/48/000000/google-logo.png';
const appleLogo = 'https://img.icons8.com/ios-filled/50/000000/mac-os.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso!', 'Login realizado com sucesso!');
      router.push('/home'); 

    } catch (error: any) {

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      } else {
        Alert.alert('Erro ao logar', error.message);
      }
    }
  };

  const handleGoogleLogin = () => console.log('Login com Google');
  const handleAppleLogin = () => console.log('Login com Apple');

  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/circulo.png')}
        style={[styles.ellipse, { top: -150, left: -100, width: 628, height: 638, opacity: 0.9 }]}
      />
      <Image
        source={require('../../assets/images/ellipse3.png')}
        style={[styles.ellipse, { top: 60, left: -80, width: 320, height: 320, opacity: 0.75 }]}
      />
      <Image
        source={require('../../assets/images/ellipse3.png')}
        style={[styles.ellipse, { top: 185, right: -60, width: 250, height: 250, opacity: 0.75 }]}
      />

      <View style={styles.logoetext}>
        <Image source={require('../../assets/images/nutria.png')} resizeMode="contain" style={styles.logo} />
        <Text style={styles.welcomeText}>Que bom que você voltou!</Text>
      </View>

      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#120D37"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#120D37"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/telasiniciais/esq_senha')}>
          <Text style={styles.forgotPasswordText}>
            Esqueceu a senha? <Text style={styles.forgotPasswordLink}>Redefina aqui.</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Image source={{ uri: googleLogo }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
            <Image source={{ uri: appleLogo }} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signupContainer} onPress={() => router.push('../telasiniciais/cadastro')}>
          <Text style={styles.signupText}>
            Não possui uma conta? <Text style={styles.signupLink}>Cadastre-se.</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  ellipse: {
    position: 'absolute',
    borderRadius: 999,
    marginTop: -150,
  },
  contentContainer: {
    flex: 1,
    marginTop: height * 0.225,
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoetext: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: -10,
    marginTop: 50,
  },
  welcomeText: {
    fontSize: 22,
    color: '#ffffffff',
    fontWeight: '300',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#BDBCC5',
    borderRadius: 5,
    paddingHorizontal: 20,
    opacity: 0.24,
    marginBottom: 15,
    color: '#120D37',
    fontSize: 11,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#120D37',
  },
  forgotPasswordLink: {
    color: '#95A720',
    fontWeight: 'bold',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#120D37',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#A0A0A0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 25,
  },
  socialButton: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  signupContainer: {
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#120D37',
  },
  signupLink: {
    color: '#95A720',
    fontWeight: 'bold',
  },
});