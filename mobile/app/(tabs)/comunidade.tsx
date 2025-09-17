import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';


import { User, onAuthStateChanged } from 'firebase/auth';
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    doc,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';


interface Post {
    id: string;
    text: string;
    authorName: string;
    authorId: string;
    createdAt: Timestamp;
}
interface UserProfile {
    nome: string;
}

const TABS = ['Seus amigos', 'Minhas postagens', 'Artigos'];


const PostCard = ({ post }: { post: Post }) => {
    const postDate = post.createdAt ? post.createdAt.toDate().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    }) : 'agora';

    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: 'https://i.imgur.com/gK9t09y.png' }}
                    style={styles.postProfileImage}
                />
                <View>
                    <Text style={styles.postAuthor}>{post.authorName}</Text>
                    <Text style={styles.postDate}>{postDate}</Text>
                </View>
            </View>
            <Text style={styles.postText}>{post.text}</Text>
        </View>
    );
};


function CommunityScreen() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);

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

  useEffect(() => {
    if (!user) return;

    setLoadingPosts(true);
    const postsQuery = query(
        collection(db, 'posts'), 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const userPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
            userPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(userPosts);
        setLoadingPosts(false);
    }, (error) => {
        console.error("Erro ao buscar posts: ", error);
        setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreatePost = async () => {
    if (newPostText.trim() === '' || !user || !userProfile) {
        Alert.alert("Atenção", "O post não pode estar vazio.");
        return;
    }

    try {
        await addDoc(collection(db, 'posts'), {
            text: newPostText,
            authorId: user.uid,
            authorName: userProfile.nome,
            createdAt: serverTimestamp(),
        });
        setNewPostText('');
        setModalVisible(false);
    } catch (error) {
        console.error("Erro ao criar post: ", error);
        Alert.alert("Erro", "Não foi possível publicar seu post.");
    }
  };

  const renderContent = () => {
    if (activeTab === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="people-outline" size={64} color="#aaa" />
          <Text style={styles.emptyText}>
            Nada de amigos por enquanto, que tal adicionar alguns?
          </Text>
          <TouchableOpacity style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Adicionar amigos</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 1) {
        if (loadingPosts) {
            return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
        }
        if (posts.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <MaterialIcons name="local-cafe" size={64} color="#aaa" />
                    <Text style={styles.emptyText}>
                        Que tal postar aquele seu café reforçado?
                    </Text>
                </View>
            );
        }
        return (
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostCard post={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        );
    }

    if (activeTab === 2) {
      return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
          <View style={[styles.articleCard, { height: 120 }]} />
          <View style={[styles.articleCard, { height: 180 }]} />
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
          <Image
            source={{ uri: 'https://i.imgur.com/gK9t09y.png' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#aaa" />
          <TextInput
            placeholder="Pesquisar"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.navigationTabs}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
            activeOpacity={0.7}
          >
            <Text style={activeTab === index ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>

      {activeTab !== 2 && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.fabText}>Novo post</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Criar postagem</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="O que você está pensando?"
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCreatePost}>
                <Text style={styles.modalButtonText}>Postar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.modalButtonCancelText]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: { width: 42, height: 42, borderRadius: 21 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 15,
    height: 42,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  activeTab: { backgroundColor: '#00b06b' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#fff', fontWeight: '700' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 10,
  },
  emptyButtonText: { color: '#119f51ff', fontWeight: '700', fontSize: 15 },
  articleCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#ff6347',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  fabText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    backgroundColor: '#00b06b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#eee',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtonCancelText: {
    color: '#555',
  },
});


export default CommunityScreen;