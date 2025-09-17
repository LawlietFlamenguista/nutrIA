import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');


const THEME = {
  activeGreen: '#90C256',
  buttonGreen: '#6A9C2C',
  rewardCardGreen: 'rgba(144, 194, 86, 0.1)',
  background: '#FFFFFF',
  textPrimary: '#222222',
  textSecondary: '#666666',
  disabledGray: '#F5F5F5',
  disabledText: '#BDBDBD',
  gold: '#FFC700',
  silver: '#C4C4C4',
  bronze: '#E59934',
  completedBackground: 'rgba(144, 194, 86, 0.15)',
};


const recompensasData = [
  { title: 'Desconto de 20% na EcoGrans', points: '3000 pontos', disabled: false },
  { title: 'Desconto de 10% na PlusTea', points: '1500 pontos', disabled: false },
  { title: 'Um pacote grátis na PlantYou', points: '4500 pontos', disabled: true },
];

const metasData = [
  { description: 'Conclua 70 refeições', points: '80 pontos', action: 'concluir', completed: false },
  { description: 'Convide 10 amigos', points: '100 pontos', action: 'convidar', completed: false },
  { description: 'Gere uma refeição na despensa', points: '50 pontos', action: 'gerar', completed: false },
  { description: 'Poste uma refeição', points: '', action: '', completed: true },
];

const rankingData = [
  { rank: 1, name: 'Rebeca Soares', handle: '@rebecasoares', avatar: 'https://i.imgur.com/r3y5J9d.png' },
  { rank: 2, name: 'Cauana Pereira', handle: '@cauanapereira', avatar: 'https://i.imgur.com/lV2a2aT.jpg' },
  { rank: 3, name: 'Camilo Damasco', handle: '@camiladamasco', avatar: 'https://i.imgur.com/gK9t09y.png' },
  { rank: 4, name: 'Filipa Brita', points: 1230, avatar: 'https://i.imgur.com/lV2a2aT.jpg' },
  { rank: 5, name: 'Henriqueta Ferreira', points: 960, avatar: 'https://i.imgur.com/gK9t09y.png' },
  { rank: 6, name: 'Joana Campos', points: 679, avatar: 'https://i.imgur.com/r3y5J9d.png' },
  { rank: 7, name: 'Joana Ferreira', points: 200, avatar: 'https://i.imgur.com/gK9t09y.png' },
];



const MeusPontosTab = () => (
  <>
    <View style={styles.pointsCard}>
      <View style={styles.pointsCardTitleContainer}>
        <Text style={styles.pointsCardTitle}>Seus pontos</Text>
        <MaterialIcons name="info-outline" size={18} color={THEME.textSecondary} />
      </View>
      <Text style={styles.pointsValue}>3000</Text>
    </View>

    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trocar pontos</Text>
        <MaterialIcons name="info-outline" size={18} color={THEME.textSecondary} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
        {recompensasData.map((item, index) => (
          <View key={index} style={[styles.rewardCard, item.disabled && styles.disabledCard]}>
            <Text style={styles.rewardTitle}>{item.title}</Text>
            <Text style={styles.rewardPoints}>{item.points}</Text>
            <TouchableOpacity
              style={[styles.rewardButton, item.disabled && styles.disabledButton]}
              disabled={item.disabled}>
              <Text style={[styles.rewardButtonText, item.disabled && styles.disabledButtonText]}>
                {item.disabled ? 'Indisponível' : 'Pegar cupom'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  </>
);

const MetasTab = () => (
  <View style={styles.contentSection}>
    {metasData.map((item, index) => (
      <View key={index} style={styles.goalCard}>
        <View>
          <Text style={styles.goalDescription}>{item.description}</Text>
          {item.points ? <Text style={styles.goalPoints}>{item.points}</Text> : null}
        </View>
        {item.completed ? (
          <View style={[styles.goalPill, styles.goalPillCompleted]}>
            <Text style={styles.goalPillTextCompleted}>concluído</Text>
          </View>
        ) : (

          null
        )}
      </View>
    ))}
  </View>
);

const MeuGrupoTab = () => {
    const podium = rankingData.slice(0, 3);
    const list = rankingData.slice(3);
    const getMedalColor = (rank) => ({ 1: THEME.gold, 2: THEME.silver, 3: THEME.bronze }[rank] || 'transparent');

    const user1 = podium.find(p => p.rank === 1);
    const user2 = podium.find(p => p.rank === 2);
    const user3 = podium.find(p => p.rank === 3);


    const PodiumUser = ({ user, elevated = false }) => {
      if (!user) return null;
      return (
        <View style={[styles.podiumUser, elevated && styles.podiumUserElevated]}>
          <View>
            <Image source={{ uri: user.avatar }} style={[styles.podiumAvatar, elevated && styles.podiumAvatarElevated]} />
            <View style={[styles.medal, { backgroundColor: getMedalColor(user.rank) }]}>
              <Text style={styles.medalText}>{user.rank}</Text>
            </View>
          </View>
          <Text style={styles.podiumName}>{user.name}</Text>
          <Text style={styles.podiumHandle}>{user.handle}</Text>
        </View>
      );
    };

    return (
        <View style={styles.contentSection}>
            <View style={styles.inviteCard}>
                <Text style={styles.inviteText}>Convide um amigo</Text>
                <View style={styles.inviteCodeContainer}>
                    <Text style={styles.inviteCode}>2372HG6</Text>
                    <TouchableOpacity>
                        <Feather name="copy" size={20} color={THEME.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="link" size={20} color={THEME.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.rankingTitle}>Ranking de pontos do seu grupo</Text>


            <View style={styles.podiumContainer}>
                <PodiumUser user={user2} />
                <PodiumUser user={user1} elevated={true} />
                <PodiumUser user={user3} />
            </View>

            {list.map((user) => (
                <View key={user.rank} style={styles.listItem}>
                    <Text style={styles.listRank}>{String(user.rank).padStart(2, '0')}</Text>
                    <Image source={{ uri: user.avatar }} style={styles.listAvatar} />
                    <Text style={styles.listName}>{user.name}</Text>
                    <Text style={styles.listPoints}>{user.points} pontos</Text>
                </View>
            ))}
        </View>
    );
};

// ===== COMPONENTE PRINCIPAL =====
export default function ConquistasScreen() {
  const [activeTab, setActiveTab] = useState('Metas'); 
  const router = useRouter();

  const TabButton = ({ title }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === title && styles.activeTabButton]}
      onPress={() => setActiveTab(title)}>
      <Text style={[styles.tabButtonText, activeTab === title && styles.activeTabButtonText]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <Image source={require('../../assets/images/grupoverde.png')} style={styles.backgroundImage} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={THEME.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Conquistas</Text>
          </View>

          <View style={styles.tabContainer}>
            <TabButton title="Meus pontos" />
            <TabButton title="Metas" />
            <TabButton title="Meu grupo" />
          </View>

          {activeTab === 'Meus pontos' && <MeusPontosTab />}
          {activeTab === 'Metas' && <MetasTab />}
          {activeTab === 'Meu grupo' && <MeuGrupoTab />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.background },
  backgroundImage: {
    position: 'absolute',
    top: -80,
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    transform: [{ scaleY: -1 }],
  },
  scrollView: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.textPrimary },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  activeTabButton: { backgroundColor: THEME.activeGreen },
  tabButtonText: { color: THEME.textSecondary, fontWeight: '600' },
  activeTabButtonText: { color: THEME.background },
  contentSection: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 15,
    backgroundColor: THEME.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 600,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.textPrimary },

  pointsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  pointsCardTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pointsCardTitle: { color: THEME.textSecondary, fontWeight: '500' },
  pointsValue: { fontSize: 28, fontWeight: 'bold', color: THEME.activeGreen },
  rewardCard: {
    backgroundColor: THEME.rewardCardGreen,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width * 0.45,
    height: 170,
    justifyContent: 'space-between',
  },
  rewardTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.textPrimary },
  rewardPoints: { color: THEME.textSecondary, fontSize: 12 },
  rewardButton: { backgroundColor: THEME.buttonGreen, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  rewardButtonText: { color: THEME.background, fontWeight: 'bold' },
  disabledCard: { backgroundColor: THEME.disabledGray },
  disabledButton: { backgroundColor: THEME.disabledText },
  disabledButtonText: { color: THEME.background },

  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  goalDescription: { fontSize: 16, fontWeight: '500', color: THEME.textPrimary },
  goalPoints: { color: THEME.textSecondary, marginTop: 5 },
  goalButton: { backgroundColor: THEME.buttonGreen, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 },
  goalButtonText: { color: THEME.background, fontWeight: 'bold' },
  goalPill: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15 },
  goalPillCompleted: { backgroundColor: THEME.completedBackground },
  goalPillTextCompleted: { color: THEME.buttonGreen, fontWeight: 'bold', fontSize: 12 },

  inviteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  inviteText: { fontSize: 16, fontWeight: '500', color: THEME.textPrimary },
  inviteCodeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', padding: 8, borderRadius: 10, gap: 10 },
  inviteCode: { fontWeight: 'bold', marginRight: 5 },
  rankingTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.textPrimary, marginBottom: 20 },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
    height: 150,
  },
  podiumUser: { alignItems: 'center', width: '33%' },
  podiumUserElevated: {
      transform: [{ translateY: -25 }],
  },
  podiumAvatar: {
      width: 75,
      height: 75,
      borderRadius: 40,
      marginBottom: 8,
      backgroundColor: '#E0E0E0'
  },
  podiumAvatarElevated: {
      width: 90,
      height: 90,
      borderRadius: 45,
  },
  medal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.background,
  },
  medalText: { color: THEME.background, fontWeight: 'bold', fontSize: 12 },
  podiumName: { fontWeight: 'bold', fontSize: 14, color: THEME.textPrimary, textAlign: 'center' },
  podiumHandle: { fontSize: 12, color: THEME.textSecondary },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  listRank: { fontSize: 16, color: THEME.textSecondary, fontWeight: 'bold', width: 40 },
  listAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  listName: { flex: 1, fontSize: 16, fontWeight: '500', color: THEME.textPrimary },
  listPoints: { fontSize: 14, fontWeight: 'bold', color: THEME.textSecondary },
});