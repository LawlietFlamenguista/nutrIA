import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Message = {
  id: string;
  title: string;
  subtitle: string;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
  iconBgColor: string;
};


const MESSAGES: Message[] = [
  {
    id: '1',
    title: 'Relatório de Junho por Nutr.IA',
    subtitle: 'Confira as estatísticas do seu último plano e a evolução da sua saúde física e mental.',
    iconName: 'zoom-out-map',
    iconColor: '#53A95E',
    iconBgColor: '#E0F5E0',
  },
  {
    id: '2',
    title: 'Saúde mental por Nutr.IA',
    subtitle: 'Como você está se sentindo? Está descontando sua ansiedade na comida? Eu posso te ajudar!',
    iconName: 'favorite-border',
    iconColor: '#E9527D',
    iconBgColor: '#FEEAF0',
  },
];


const THEME = {
  bg: '#f6f7fb',
  white: '#ffffff',
  gray700: '#374151',
  gray600: '#4b5563',
  gray500: '#6b7280',
  indigo900: '#1f2937',
  gray200: '#e5e7eb',
};


const MessageCard = ({ message, onPress }: { message: Message, onPress: () => void }) => (

  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={1}> 
    <View style={[styles.iconContainer, { backgroundColor: message.iconBgColor }]}>
      <MaterialIcons name={message.iconName} size={24} color={message.iconColor} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{message.title}</Text>
      <Text style={styles.cardSubtitle}>{message.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function MensagensScreen() {

    const handlePressMessage = (messageId: string) => {
        console.log(`Mensagem com ID ${messageId} foi clicada.`);

    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://i.imgur.com/gK9t09y.png' }}
                    style={styles.profileImage}
                />
                <Text style={styles.headerTitle}>Mensagens</Text>
                <TouchableOpacity style={styles.notificationButton}>
                    <MaterialIcons name="notifications" size={24} color={THEME.gray700} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageCard
                        message={item}
                        onPress={() => handlePressMessage(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: THEME.white,
    borderBottomWidth: 1,
    borderBottomColor: THEME.gray200,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.indigo900,
    flex: 1,
    marginLeft: 16,
  },
  notificationButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.indigo900,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: THEME.gray500,
  },
  separator: {
    height: 12,
  },
});