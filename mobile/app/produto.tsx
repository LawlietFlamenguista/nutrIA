
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';


type ProdutoBase = {
  id: string;
  code: string;
  nome: string;
  imagem: string;
  quantidade: number;
};


type Nutriments = {
  energy_kcal?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  'trans-fat_100g'?: number;
  fiber_100g?: number;
  sodium_100g?: number;
  sugars_100g?: number;
  'added-sugars_100g'?: number;
};

type ProductAPI = {
  product_name?: string;
  quantity?: string;
  image_front_url?: string;
  nutriments?: Nutriments;
  nutrition_grades_tags?: string[];
  expiration_date?: string;
};

type OpenFoodFactsResponse = {
  product?: ProductAPI;
};


type RootStackParamList = {
  produto: {
    produto: ProdutoBase;
    atualizarProdutos: (code: string, novaQtd: number) => void;
  };

};


type ProdutoScreenNavigationProp = NavigationProp<RootStackParamList, 'produto'>;
type ProdutoScreenRouteProp = RouteProp<RootStackParamList, 'produto'>;


type NutriBoxProps = {
  cor: string;
  valor: number;
  label: string;
};

type FooterBoxProps = {
  label: string;
  valor: string | number;
};



export default function Produto(): React.JSX.Element | null {
  const navigation = useNavigation<ProdutoScreenNavigationProp>();
  const route = useRoute<ProdutoScreenRouteProp>();
  

  const { produto, atualizarProdutos } = route.params;

  const [dadosAPI, setDadosAPI] = useState<ProductAPI | null>(null);
  const [quantidade, setQuantidade] = useState<number>(produto?.quantidade || 1);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!produto?.code) return;
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${produto.code}.json`);
        const json: OpenFoodFactsResponse = await res.json();
        setDadosAPI(json.product || {});
      } catch (e) {
        console.error('Erro ao buscar produto:', e);
      }
    };
    fetchProduto();
  }, [produto]);

  if (!produto) {
    return null; 
  }

  const nutriments = dadosAPI?.nutriments || {};
  const nivelQualidade = dadosAPI?.nutrition_grades_tags?.[0] || 'unknown';
  const validade = dadosAPI?.expiration_date || 'Não disponível';

  const alterarQuantidade = (novoValor: number): void => {
    const valorFinal = Math.max(1, novoValor); 
    setQuantidade(valorFinal);

    if (atualizarProdutos) {
      atualizarProdutos(produto.code, valorFinal);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={28} color="#3CB371" />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do Produto</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Imagem */}
        <Image
          source={{ uri: dadosAPI?.image_front_url || produto.imagem }}
          style={styles.imagem}
        />

        {/* Nome e código */}
        <Text style={styles.nome}>
          {dadosAPI?.product_name || produto.nome} - {dadosAPI?.quantity || ''}
        </Text>
        <Text style={styles.codigo}>{produto.code}</Text>

        {/* Nutrientes principais */}
        <View style={styles.nutriContainer}>
          <NutriBox cor="#FFD6D6" valor={Math.round(nutriments.energy_kcal || 0)} label="Calorias" />
          <NutriBox cor="#D6FFD6" valor={Math.round(nutriments.proteins_100g || 0)} label="Proteínas" />
          <NutriBox cor="#D6D6FF" valor={Math.round(nutriments.carbohydrates_100g || 0)} label="Carbs" />
          <NutriBox cor="#FFF3D6" valor={Math.round(nutriments.fat_100g || 0)} label="Gorduras" />
        </View>

        {/* Detalhes extras */}
        <View style={styles.extras}>
            <Text style={styles.extraLabel}>Gorduras saturadas: {Math.round(nutriments['saturated-fat_100g'] || 0)}g</Text>
            <Text style={styles.extraLabel}>Açúcares totais: {Math.round(nutriments.sugars_100g || 0)}g</Text>
            <Text style={styles.extraLabel}>Fibras: {Math.round(nutriments.fiber_100g || 0)}g</Text>
            <Text style={styles.extraLabel}>Sódio: {Math.round(nutriments.sodium_100g || 0)}mg</Text>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <FooterBox label="Nutri-Score" valor={nivelQualidade.toUpperCase()} />
          <View style={styles.footerBox}>
            <Text style={styles.footerLabel}>Meu estoque</Text>
            <View style={styles.qtdContainer}>
              <TouchableOpacity style={styles.qtdBtn} onPress={() => alterarQuantidade(quantidade - 1)}>
                <Text style={styles.qtdText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.footerValor}>{quantidade}</Text>
              <TouchableOpacity style={styles.qtdBtn} onPress={() => alterarQuantidade(quantidade + 1)}>
                <Text style={styles.qtdText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FooterBox label="Validade" valor={validade} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




function NutriBox({ cor, valor, label }: NutriBoxProps): React.JSX.Element {
  return (
    <View style={[styles.nutriBox, { backgroundColor: cor }]}>
      <Text style={styles.nutriValor}>{valor}</Text>
      <Text style={styles.nutriLabel}>{label}</Text>
    </View>
  );
}

function FooterBox({ label, valor }: FooterBoxProps): React.JSX.Element {
  return (
    <View style={styles.footerBox}>
      <Text style={styles.footerLabel}>{label}</Text>
      <Text style={styles.footerValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  imagem: { width: 160, height: 160, alignSelf: 'center', marginBottom: 15, resizeMode: 'contain' },
  nome: { fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, paddingHorizontal: 20 },
  codigo: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 20 },
  nutriContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingHorizontal: 20 },
  nutriBox: { width: 70, height: 70, borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  nutriValor: { fontWeight: 'bold', fontSize: 16 },
  nutriLabel: { fontSize: 10, color: '#555', textAlign: 'center' },
  extras: { paddingHorizontal: 25, marginBottom: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginHorizontal: 20 },
  extraLabel: { fontSize: 13, color: '#555', marginBottom: 5 },
  qtdContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  qtdBtn: { backgroundColor: '#e9e9e9', width: 30, height: 30, borderRadius: 15, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  qtdText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
  footerBox: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10, flex: 1, marginHorizontal: 5, justifyContent: 'center' },
  footerLabel: { fontSize: 10, color: '#888', marginBottom: 5, textAlign: 'center' },
  footerValor: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});