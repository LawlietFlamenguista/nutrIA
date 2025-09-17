import { useNavigation } from '@react-navigation/native'; 
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigation = useNavigation(); 

    const handleGoBack = () => {
        
        navigation.goBack(); 
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
       
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText} >Esqueci a senha</Text>
            </View>

           
            <View style={styles.main}>
                
                <Image
                    source={require('../../assets/images/esqueci.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Esqueceu a senha?</Text>
                <Text style={styles.description}>
                    Por favor, insira seu e-mail para receber um código de segurança e definir uma nova senha.
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#A0AEC0"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, (!email || isLoading) && styles.buttonDisabled]}
                    disabled={!email || isLoading}
                    onPress={handleSubmit}
                >
                    {isLoading ? (
                        <>
                            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Enviando...</Text>
                        </>
                    ) : (
                        <Text style={styles.buttonText}>Confirmar e-mail</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#EAEFF5', 
        paddingTop: 180, 
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 70,
        left: 20,
        zIndex: 1,
    },
    backButton: {
        paddingRight: 10,
    },
    headerText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    main: {
        alignItems: 'center',
        padding: 0,
        marginTop: -30, 
    },
    illustration: {
        width: '100%',
        height: 250,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1B0C45',
        marginBottom: 18,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#1B0C45',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22, 
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#D7DAE0', 
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    input: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#1A202C',
        padding: 0, 
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#120D37', 
        borderRadius: 100, 
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#A0AEC0', 
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;