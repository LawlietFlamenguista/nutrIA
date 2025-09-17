import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';

// ## Tipos ##
type Produto = {
  id: string;
  code: string;
  nome: string;
  quantidade: number;
  imagem: string;
};

type AdicionarItem = { id: 'adicionar'; type: 'adicionar' };
type ProdutoItem = Produto & { type: 'produto' };
type GridItemType = AdicionarItem | ProdutoItem;

type RootStackParamList = {
  Despensa: { novoProduto?: Produto };
  produto: {
    produto: Produto;
    atualizarProdutos: (code: string, novaQtd: number) => void;
  };
  leitor: undefined;
};

type DespensaScreenNavigationProp = NavigationProp<RootStackParamList, 'Despensa'>;
type DespensaScreenRouteProp = RouteProp<RootStackParamList, 'Despensa'>;

// ## Componente Principal ##
function AppContent(): React.JSX.Element {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DespensaScreenNavigationProp>();
  const route = useRoute<DespensaScreenRouteProp>();
  const lastAddedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const novoProduto = route.params?.novoProduto;
    if (!novoProduto) return;

    if (novoProduto.id !== lastAddedIdRef.current) {
      setProdutos(prev => {
        const existe = prev.find(p => p.code === novoProduto.code);
        if (existe) {
          return prev.map(p =>
            p.code === novoProduto.code
              ? { ...p, quantidade: p.quantidade + novoProduto.quantidade }
              : p
          );
        }
        return [novoProduto, ...prev];
      });
      lastAddedIdRef.current = novoProduto.id;
      navigation.setParams({ novoProduto: undefined });
    }
  }, [route.params?.novoProduto, navigation]);

  const desfazerSelecao = (): void => {
    setSelecionado(null);
    Keyboard.dismiss();
  };

  const atualizarQuantidade = (code: string, novaQtd: number): void => {
    setProdutos(prev => prev.map(p => (p.code === code ? { ...p, quantidade: novaQtd } : p)));
  };

  const renderCardItem = ({ item }: { item: Produto }): React.JSX.Element => {
    const estaSelecionado = item.id === selecionado;
    const nomeResumido = item.nome ? item.nome.split(' ').slice(0, 2).join(' ') : '';

    return (
      <TouchableOpacity
        style={[styles.card, estaSelecionado && styles.cardSelecionado]}
        onLongPress={() => setSelecionado(item.id)}
        delayLongPress={250}
        onPress={() => {
          if (estaSelecionado) {
            setProdutos(produtos.filter((p) => p.id !== item.id));
            setSelecionado(null);
          } else {
            navigation.navigate('produto', {
              produto: item,
              atualizarProdutos: atualizarQuantidade,
            });
          }
        }}
        activeOpacity={0.8}
      >
        {estaSelecionado ? (
          <>
            <MaterialIcons name="delete" size={28} color="#fff" />
            <Text style={styles.textoExcluir}>Clique para excluir</Text>
          </>
        ) : (
          <>
            <Image source={{ uri: item.imagem }} style={styles.produtoImagem} />
            <Text style={styles.cardTexto} numberOfLines={2} ellipsizeMode="tail">
              {nomeResumido}
            </Text>
            <Text style={styles.cardQuantidade}>
              {item.quantidade} restante{item.quantidade > 1 ? 's' : ''}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item }: ListRenderItemInfo<GridItemType>): React.JSX.Element => {
    if (item.type === 'adicionar') {
      return (
        <TouchableOpacity
          style={styles.cardAdicionar}
          onPress={() => navigation.navigate('leitor')}
          activeOpacity={0.8}
        >
          <Ionicons name="barcode-outline" size={32} color="#3CB371" />
          <Text style={styles.adicionarTexto}>Adicionar{'\n'}novo produto</Text>
        </TouchableOpacity>
      );
    } else {
      return renderCardItem({ item });
    }
  };

  const dadosFlatList: GridItemType[] = [
    { id: 'adicionar', type: 'adicionar' },
    ...produtos.map((p): ProdutoItem => ({ ...p, type: 'produto' })),
  ];

  return (
    <TouchableWithoutFeedback onPress={desfazerSelecao}>
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'android' ? insets.top : 0,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.perfil}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40/85B5F3/FFFFFF' }}
              style={styles.perfilIcone}
            />
            <Text style={styles.titulo}>Minha despensa</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color="#888" />
        </View>

        {/* Abas */}
        <View style={styles.abas}>
          <TouchableOpacity style={styles.abaAtiva}>
            <Text style={styles.abaTextoAtiva}>Meus itens</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.abaInativa}>
            <Text style={styles.abaTexto}>Lista de compras</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitulo}>Escaneie seus produtos e salve-os aqui.</Text>

        {/* Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={dadosFlatList}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={renderGridItem}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
        


      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default function Despensa(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}


const CARD_WIDTH = 110;
const CARD_HEIGHT = 140;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  perfil: { flexDirection: 'row', alignItems: 'center' },
  perfilIcone: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10, borderWidth: 2, borderColor: '#3CB371' },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  abas: { flexDirection: 'row', marginTop: 10, marginBottom: 20, paddingHorizontal: 20 },
  abaAtiva: { backgroundColor: '#E0F0E0', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 30, marginRight: 15 },
  abaInativa: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 30 },
  abaTextoAtiva: { color: '#3CB371', fontWeight: 'bold' },
  abaTexto: { color: '#888' },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 20, paddingHorizontal: 20 },
  gridContainer: { flex: 1, paddingHorizontal: 10 },
  flatListContent: { paddingBottom: 20 },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: '#fff', margin: 5, borderRadius: 15, justifyContent: 'flex-start', alignItems: 'center', borderWidth: 1, borderColor: '#eee', padding: 5 },
  cardSelecionado: { backgroundColor: '#FF3B30' },
  textoExcluir: { color: '#fff', marginTop: 5, fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  produtoImagem: { width: 80, height: 80, marginBottom: 5, resizeMode: 'contain', marginTop: 5 },
  cardTexto: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 2 },
  cardQuantidade: { fontSize: 12, color: '#888', textAlign: 'center' },
  cardAdicionar: { width: CARD_WIDTH, height: CARD_HEIGHT, borderStyle: 'dashed', borderWidth: 2, borderColor: '#3CB371', borderRadius: 15, justifyContent: 'center', alignItems: 'center', margin: 5, padding: 5 },
  adicionarTexto: { fontSize: 12, textAlign: 'center', marginTop: 6, color: '#3CB371' },
});