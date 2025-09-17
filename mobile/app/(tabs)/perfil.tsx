import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';


import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; 

interface UserProfile {
  nome: string;
  sobrenome: string;
}

const THEME = {
  green: '#44BC7F',
  bg: '#EDEDED',
  white: '#ffffff',
  gray700: '#1B0C45',
  gray600: '#A8BA31',
  gray500: '#BFBEBF',
};

type MenuItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  text: string;
  onPress: () => void;
  isLast?: boolean;
};

type MenuItemData = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  text: string;
  action: string | (() => void);
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress, isLast }) => (
  <TouchableOpacity style={[styles.menuItem, isLast && styles.menuItemLast]} onPress={onPress}>
    <MaterialIcons name={icon} size={32} color={THEME.gray600} style={styles.menuIcon} />
    <Text style={styles.menuText}>{text}</Text>
    <MaterialIcons name="chevron-right" size={24} color={THEME.gray500} />
  </TouchableOpacity>
);

export default function PerfilScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        }
      } else {
        router.replace('/telasiniciais/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  };

  const handlePress = (action: string | (() => void)) => {
    if (typeof action === 'string') {
      if (action) router.push(action as any);
    } else {
      action();
    }
  };

  const openInstagramProfile = () => {
    const username = 'nutr.ia__';
    const appURL = `instagram://user?username=${username}`;
    const webURL = `https://www.instagram.com/${username}/`;

    Linking.canOpenURL(appURL).then((supported) => {
      if (supported) Linking.openURL(appURL);
      else Linking.openURL(webURL);
    });
  };

  const menuItems: MenuItemData[] = [
    { icon: 'person-outline', text: 'Editar perfil', action: '/telasperfil/editar' },
    { icon: 'emoji-events', text: 'Conquistas', action: '/telasperfil/conquistas' },
    { icon: 'settings', text: 'Preferências', action: '/telasperfil/config' },
    { icon: 'notifications-none', text: 'Notificações', action: '/telasperfil/notificacao' },
    { icon: 'credit-card', text: 'Assinatura', action: '/telasperfil/assinatura' },
    { icon: 'lock-outline', text: 'Privacidade', action: '/telasperfil/privacidade' },
    { icon: 'help-outline', text: 'Ajuda', action: openInstagramProfile },
    { icon: 'logout', text: 'Sair', action: handleLogout },
  ];

  const displayName = userProfile ? `${userProfile.nome} ${userProfile.sobrenome}` : 'Carregando...';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.greenBackgroundLayer}>
          <Image source={require('../../assets/images/ellipse3.png')} style={styles.headerEllipse1} />
          <Image source={require('../../assets/images/ellipse3.png')} style={styles.headerEllipse2} />
          <Image source={require('../../assets/images/ellipse3.png')} style={styles.headerEllipse3} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: 'https://i.imgur.com/gK9t09y.png' }} style={styles.profileImage} />
            <Text style={styles.profileName}>{displayName}</Text>
          </View>
          
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                onPress={() => handlePress(item.action)}
                isLast={index === menuItems.length - 1}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Nutr.IA - Gerador de plano alimentar</Text>
            <Text style={styles.footerText}>Versão 1.0</Text>
            <Text style={styles.footerText}>2025 Nutr.IA, ltd.</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => handlePress('/politica-privacidade')}>
                <Text style={styles.footerLinkText}>Política de privacidade</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkText}> • </Text>
              <TouchableOpacity onPress={() => handlePress('/termos-uso')}>
                <Text style={styles.footerLinkText}>Termos de Uso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.bg },
  container: { flex: 1 },
  greenBackgroundLayer: {
    backgroundColor: THEME.green,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    overflow: 'hidden',
  },
  headerEllipse1: { position: 'absolute', top: -10, right: 200, width: 240, height: 240, resizeMode: 'contain', opacity: 1 },
  headerEllipse2: { position: 'absolute', top: 210, left: -60, width: 220, height: 220, resizeMode: 'contain', alignSelf: 'center', opacity: 1 },
  headerEllipse3: { position: 'absolute', top: 170, left: 200, width: 250, height: 250, resizeMode: 'contain', opacity: 1 },
  scrollViewContent: { paddingBottom: 20 },
  profileHeader: { alignItems: 'center', paddingTop: 40, paddingBottom: 80 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: THEME.white, marginBottom: 10 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: THEME.white },
  menuContainer: { backgroundColor: THEME.white, marginHorizontal: 16, borderRadius: 15, paddingVertical: 20, marginTop: -60 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: { marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: THEME.gray700 },
  footer: { alignItems: 'center', marginTop: 30, paddingBottom: 20 },
  footerText: { fontSize: 12, color: THEME.gray500, marginBottom: 4 },
  footerLinks: { flexDirection: 'row', marginTop: 10 },
  footerLinkText: { fontSize: 12, color: THEME.gray600, fontWeight: 'bold' },
});