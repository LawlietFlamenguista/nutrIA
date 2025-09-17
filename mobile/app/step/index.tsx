import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Header } from '../../components/header'
import { Input } from '../../components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDataStore } from '../../store/data'


import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const schema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório"}),
  weight: z.string().min(1, { message: "O peso é obrigatório"}),
  age: z.string().min(1, { message: "A idade é obrigatória"}),
  height: z.string().min(1, { message: "A altura é obrigatória"})
});

type FormData = z.infer<typeof schema>;

export default function Step(){
  const { control, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const setPageOne = useDataStore(state => state.setPageOne);

  async function handleCreate(data: FormData){
    const currentUser = auth.currentUser;
    if (!currentUser) {
        Alert.alert("Erro de Sessão", "Não foi possível identificar o usuário. Por favor, reinicie o aplicativo.");
        return;
    }
    

    setPageOne({
      name: data.name,
      weight: data.weight,
      age: data.age,
      height: data.height
    });

    try {

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        nome: data.name,
        peso: data.weight,
        altura: data.height,
        idade: data.age
      }, { merge: true }); 


      router.push("/create");
      
    } catch (error) {
      console.error("Erro ao salvar dados iniciais:", error);
      Alert.alert("Erro", "Não foi possível salvar seus dados. Tente novamente.");
    }
  }

  function handleSkip(){
    console.log("Pulando validação, indo para a próxima tela");
    router.push("/create");
  }

  return(
    <View>
      <Header/>
      <ScrollView style={styles.content}>
        <Text style={styles.titulo}>Preencha as informações abaixo!</Text>

        <Text style={styles.label}>Nome:</Text>
        <Input
          name="name" 
          control={control}
          placeholder="Digite seu nome..."      
          error={errors.name?.message}
          keyboardType="default"          
        />

        <Text style={styles.label}>Peso:</Text>
        <Input
          name="weight" 
          control={control}
          placeholder="Digite seu peso..."      
          error={errors.weight?.message}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Altura:</Text>
        <Input
          name="height" 
          control={control}
          placeholder="Digite sua altura, Ex: 175 (em cm)"      
          error={errors.height?.message}
          keyboardType="numeric"          
        />

        <Text style={styles.label}>Idade:</Text>
        <Input
          name="age" 
          control={control}
          placeholder="Digite sua idade..."      
          error={errors.age?.message}
          keyboardType="numeric"          
        />

        <Pressable style={styles.botao} onPress={handleSubmit(handleCreate)}>
          <Text style={styles.textoBotao}>Próximo</Text>    
        </Pressable>

        <Pressable style={[styles.botao, styles.botaoSecundario]} onPress={handleSkip}>
          <Text style={styles.textoBotao}>Próximo (sem validar)</Text>    
        </Pressable>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  titulo: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent:'center',
    alignItems:'center',
    marginBottom: 30,
    marginRight: 50
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  botao: {
    backgroundColor: '#000c38',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 12
  },
  botaoSecundario: {
    backgroundColor: '#555' 
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});