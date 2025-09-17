import { Header } from '@/components/header';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { Select } from '../../components/input/select';
import { useDataStore } from '../../store/data';


const schema = z.object({
    gender: z.string().min(1, { message: "O sexo é obrigatório"}),
    objective: z.string().min(1, { message: "O objetivo é obrigatório"}),
    level: z.string().min(1, { message: "Selecione o seu nível"}),

})

type FormData = z.infer<typeof schema>

export default function Create() {

    const { control, handleSubmit, formState: {errors, isValid}} = useForm<FormData>({
            resolver: zodResolver(schema)
        })

        const setPageTwo = useDataStore(state => state.setPageTwo)

        const genderOptions = [
            { label: "Masculino", value: "masculino"},
            { label: "Feminino", value: "feminino"},
        ]

        const levelOptions = [
             { label: "Sedentario (pouco ou nenhuma atividade física", value: "Sedentario"},
             { label: "Levemente ativo (exercícios 1 a 3 vezes na semana)", value: "Levemente ativo (exercícios 1 a 3 vezes na semana)"},
             { label: "Moderadamente ativo (exercícios 3 a 5 vezes na semana)", value: "Moderadamente ativo (exercícios 3 a 5 vezes na semana)"},
             { label: "Altamente ativo (exercícios 5 a 7 vezes na semana)", value: "Altamente ativo (exercícios 5 a 7 vezes na semana)"},
        ]

        const objectiveOptions = [
            { label: "Emagrecer", value: "emagrecer"},
            { label: "Hipertrofia", value: "hipertrofia"},
            { label: "Hipertrofia + Definição", value: "hipertrofia + definição"},
            { label: "Definição", value: "definição"},
        ]

        function handleCreate(data: FormData){
            setPageTwo({
                level: data.level,
                gender: data.gender,
                objective: data.objective
            })

            router.push("/nutrition")

        }

        function handleSkip(){
    console.log("Pulando validação, indo para a próxima tela")
    router.push("/plano/plano")
  }

    return(
        <View style={styles.container}>
            <Header/>

            <ScrollView style={styles.content}>
                <Text style={styles.titulo}>Preencha as informações abaixo!</Text>

                <Text style={styles.label}>Sexo:</Text>
                <Select
                control={control}
                name="gender"
                placeholder="Selecione o seu sexo..."
                error={errors.gender?.message}
                options={genderOptions}
                />

                 <Text style={styles.label}>Selecione o nível de atividade fisica:</Text>
                <Select
                control={control}
                name="level"
                placeholder="Selecione o nível de atividade fisica..."
                error={errors.level?.message}
                options={levelOptions}
                />

                <Text style={styles.label}>Selecione seu objetivo:</Text>
                <Select
                control={control}
                name="objective"
                placeholder="Selecione seu objetivo..."
                error={errors.objective?.message}
                options={objectiveOptions}
                />

                <Pressable style={styles.botao} onPress={handleSubmit(handleCreate)}>
                                    <Text style={styles.textoBotao}>Próximo</Text>    
                                </Pressable>

                                <Pressable style={[styles.botao, styles.botaoSecundario]} onPress={handleSkip}>
                                          <Text style={styles.textoBotao}>Próximo (sem validar)</Text>    
                                        </Pressable>
                
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },

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
    borderRadius: 4
},

textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
},

botaoSecundario: {
    backgroundColor: '#555' 
  },

})