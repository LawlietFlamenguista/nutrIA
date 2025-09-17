import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const THEME = {
  purpleDark: '#1F004D',
  idBackground: '#BDBCC53D',
  white: '#ffffff',
  textGray: '#888888',
  textBlack: '#333333',
  greenStar: '#28A745',
  borderGray: '#E0E0E0',
};

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);


  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [sexo, setSexo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');

  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();

          setNome(data.nome || '');
          setSobrenome(data.sobrenome || '');
          setDataNascimento(data.dataNascimento || '');
          setSexo(data.sexo || '');
          setPeso(data.peso || '');
          setAltura(data.altura || '');
          setIdade(data.idade || '');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoBack = () => router.back();

  const handleEditInfo = async () => {
    if (!user) {
      Alert.alert("Erro", "Você não está logado.");
      return;
    }
    if (!nome) {
      Alert.alert("Atenção", "O nome é obrigatório.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        nome: nome,
        sobrenome: sobrenome,
        dataNascimento: dataNascimento,
        sexo: sexo,
        peso: peso,
        altura: altura,
        idade: idade,
      });

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      console.error(error);
    }
  };

  const handleCopyID = () => {
    if (user?.uid) {
      Alert.alert("ID Copiado!", user.uid);
    }
  };
  
  const handleSelectGender = (selectedGender: string) => {
    setSexo(selectedGender);
    setGenderModalVisible(false);
  };
  
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (event.type === 'set') {
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate().toString().padStart(2, '0') + '/' + (tempDate.getMonth() + 1).toString().padStart(2, '0') + '/' + tempDate.getFullYear();
        setDataNascimento(fDate);
    }
  };

  const GENDER_OPTIONS = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={THEME.textBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/r3y5J9d.png' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageIcon}>
            <MaterialIcons name="edit" size={20} color={THEME.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.idSection}>
          <View style={styles.idDisplay}>
            <Text style={styles.idLabel}>Meu ID</Text>
            <View style={styles.idValueContainer}>
              <Text style={styles.idValue} numberOfLines={1} ellipsizeMode="tail">
                {user?.uid || '...'}
              </Text>
              <TouchableOpacity onPress={handleCopyID} style={styles.copyIcon}>
                <MaterialIcons name="content-copy" size={20} color={THEME.textGray} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.editInfoButton} onPress={handleEditInfo}>
            <Text style={styles.editInfoButtonText}>Editar informações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Nome <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput style={styles.textInput} value={nome} onChangeText={setNome} />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Sobrenome</Text>
            <TextInput style={styles.textInput} value={sobrenome} onChangeText={setSobrenome} />
          </View>
          <TouchableOpacity style={styles.inputCard} onPress={() => setGenderModalVisible(true)}>
            <Text style={styles.inputLabel}>Sexo</Text>
            <Text style={styles.textInput}>{sexo}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputCard} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.inputLabel}>Data de nascimento</Text>
            <Text style={styles.textInput}>{dataNascimento}</Text>
          </TouchableOpacity>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Idade</Text>
            <TextInput style={styles.textInput} value={idade} onChangeText={setIdade} keyboardType="numeric" />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Peso (kg)</Text>
            <TextInput style={styles.textInput} value={peso} onChangeText={setPeso} keyboardType="numeric" />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Altura (cm)</Text>
            <TextInput style={styles.textInput} value={altura} onChangeText={setAltura} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.requiredMessage}>
          <Text style={styles.requiredStar}>*</Text> indica um campo obrigatório
        </Text>
      </ScrollView>

      <Modal
        transparent={true}
        visible={isGenderModalVisible}
        animationType="fade"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setGenderModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione o sexo</Text>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity key={option} style={styles.optionButton} onPress={() => handleSelectGender(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.white },
  scrollView: { flex: 1 },
  contentContainer: { alignItems: 'center', paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 15, paddingVertical: 15, marginBottom: 20 },
  backButton: { marginRight: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.textBlack },
  profileImageContainer: { marginBottom: 30, position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  editImageIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.purpleDark, borderRadius: 20, padding: 8, borderWidth: 2, borderColor: THEME.white },
  idSection: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '90%',
    marginBottom: 30,
  },
  idDisplay: {
    backgroundColor: THEME.idBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  idLabel: { fontSize: 12, color: THEME.textGray, marginBottom: 2 },
  idValueContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  idValue: { fontSize: 16, fontWeight: 'bold', color: THEME.textBlack },
  copyIcon: { padding: 5 },
  editInfoButton: {
    backgroundColor: THEME.purpleDark,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editInfoButtonText: { color: THEME.white, fontSize: 14, fontWeight: 'bold' },
  inputSection: { width: '90%' },
  inputCard: {
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.borderGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 15,
  },
  inputLabel: { fontSize: 12, color: THEME.textGray, marginBottom: 2 },
  textInput: { fontSize: 16, color: THEME.textBlack, fontWeight: '500', padding: 0 },
  requiredStar: { color: THEME.greenStar },
  requiredMessage: { width: '90%', fontSize: 12, color: THEME.textGray, textAlign: 'left' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: THEME.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.textBlack,
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderGray,
  },
  optionText: {
    fontSize: 16,
    color: THEME.textBlack,
    textAlign: 'center',
  },
});