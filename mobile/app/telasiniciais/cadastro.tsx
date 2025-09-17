import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; 

const { width } = Dimensions.get('window');

const googleLogo = 'https://img.icons8.com/color/48/000000/google-logo.png';
const appleLogo = 'https://img.icons8.com/ios-filled/50/000000/mac-os.png';

export default function Cadastro() {
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);


  const handleCadastro = async () => {

    if (senha !== confirmarSenha) {
      Alert.alert('', 'As senhas não coincidem.');
      return;
    }
    if (!usuario || !sobrenome || !email || !dataNascimento || !senha) {
      Alert.alert('', 'Preencha todos os campos obrigatórios.');
      return;
    }


    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Erro', 'Nenhuma sessão de usuário encontrada. Por favor, reinicie o app.');
      return;
    }

    try {

      const credential = EmailAuthProvider.credential(email, senha);


      await linkWithCredential(currentUser, credential);


      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        nome: usuario,
        sobrenome: sobrenome,
        dataNascimento: dataNascimento,
        email: email.toLowerCase(),
        createdAt: new Date(),
      }, { merge: true }); 

      Alert.alert('Sucesso!', 'Conta criada e plano salvo com sucesso!');
      router.replace('/(tabs)/home'); 

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este e-mail já está associado a outra conta. Tente fazer login.');
      } else {
        Alert.alert('Erro ao criar conta', error.message);
      }
    }
  };


  const handleGoogleLogin = () => console.log('Login com Google');
  const handleAppleLogin = () => console.log('Login com Apple');

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFontSize = (inputName: string) => (activeInput === inputName ? 19 : 10);

  return (
    <View style={styles.container}>

      <View style={styles.formu}>
        <Image 
          source={require('../../assets/images/nutria1.png')}
          style={styles.logoImage}
        />
        <TextInput
          style={[styles.input, { fontSize: getFontSize('usuario'), textAlignVertical: 'center' }]}
          placeholder="Nome"
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={usuario}
          onChangeText={setUsuario}
          onFocus={() => setActiveInput('usuario')}
          onBlur={() => setActiveInput(null)}
        />
        <TextInput
          style={[styles.input, { fontSize: getFontSize('sobrenome'), textAlignVertical: 'center' }]}
          placeholder="Sobrenome"
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={sobrenome}
          onChangeText={setSobrenome}
          onFocus={() => setActiveInput('sobrenome')}
          onBlur={() => setActiveInput(null)}
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setShowDatePicker(true);
            setActiveInput('dataNascimento');
          }}
        >
          <Text style={{ color: selectedDate ? '#000' : 'rgba(0,0,0,0.4)', fontSize: getFontSize('dataNascimento'), paddingTop: 5 }}>
            {selectedDate ? formatDate(selectedDate) : 'Data de nascimento'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date(2000, 0, 1)}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              setActiveInput(null);
              if (date) {
                setSelectedDate(date);
                setDataNascimento(formatDate(date));
              }
            }}
          />
        )}
        <TextInput
          style={[styles.input, { fontSize: getFontSize('email'), textAlignVertical: 'center' }]}
          placeholder="E-mail"
          placeholderTextColor="rgba(0,0,0,0.4)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setActiveInput('email')}
          onBlur={() => setActiveInput(null)}
        />
        <TextInput
          style={[styles.input, { fontSize: getFontSize('senha'), textAlignVertical: 'center' }]}
          placeholder="Senha"
          placeholderTextColor="rgba(0,0,0,0.4)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          onFocus={() => setActiveInput('senha')}
          onBlur={() => setActiveInput(null)}
        />
        <TextInput
          style={[styles.input, { fontSize: getFontSize('confirmarSenha'), textAlignVertical: 'center' }]}
          placeholder="Confirmar senha"
          placeholderTextColor="rgba(0,0,0,0.4)"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          onFocus={() => setActiveInput('confirmarSenha')}
          onBlur={() => setActiveInput(null)}
        />
        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Image source={{ uri: googleLogo }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
            <Image source={{ uri: appleLogo }} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.normalText}>Já possui uma conta? </Text>
          <Text
            style={styles.linkText}
            onPress={() => router.push('../telasiniciais/login')}
          >
            Entrar
          </Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  formu: {
    width: '90%',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 217.97, 
    height: 51,  
    marginBottom: 30,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(189,188,197,0.24)',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 5,
    marginVertical: 8,
    color: '#333',
  },
  botao: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 79,
    backgroundColor: '#120D37',
    alignItems: 'center',
    marginTop: 25,
  },
  botaoTexto: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d3d3',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#a9a9a9',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  textRow: {
    flexDirection: 'row',
    marginTop: 30,
  },
  normalText: {
    fontSize: width * 0.035,
    color: '#a9a9a9',
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: width * 0.035,
    color: '#7DA123',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});