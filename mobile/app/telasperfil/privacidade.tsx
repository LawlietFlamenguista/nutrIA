import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    SafeAreaView,
    StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';


import Icon from 'react-native-vector-icons/Feather';

const router = useRouter();
type PrivacyOption = {
    id: number;
    label: string;
    isDestructive: boolean;
};

const options: PrivacyOption[] = [
    { id: 1, label: 'Trocar a senha', isDestructive: false },
    { id: 2, label: 'Trocar e-mail', isDestructive: false },
    { id: 3, label: 'Sair da conta', isDestructive: false },
    { id: 4, label: 'Excluir conta', isDestructive: true },
];

const Privacidade: React.FC = () => {
    return (
        <SafeAreaView style={styles.screenContainer}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="chevron-left" size={32} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacidade</Text>
            </View>

            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity key={option.id} style={styles.optionButton}>
                        <Text style={[
                            styles.optionLabel, 
                            option.isDestructive && styles.deleteLabel
                        ]}>
                            {option.label}
                        </Text>
                        <Icon name="chevron-right" size={24} color="#a0a0a0" />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        backgroundColor: '#8BC34A',
        paddingTop: 50,
        paddingBottom: 60,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 50,
    },
    optionsContainer: {
        backgroundColor: '#f0f2f5',
        padding: 20,
        marginTop: -30, 
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        zIndex: 2,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 15,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,

        elevation: 3,
    },
    optionLabel: {
        fontSize: 16,
        color: '#333',
    },
    deleteLabel: {
        color: '#E53935',
        fontWeight: 'bold',
    },
});

export default Privacidade;