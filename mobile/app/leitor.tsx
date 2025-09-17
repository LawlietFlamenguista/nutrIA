import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera'; 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';


type Produto = {
  id: string;
  code: string;
  nome: string;
  imagem: string;
  quantidade: number;
};


type RootStackParamList = {
  despensa: { novoProduto?: Produto };
  leitor: undefined;

};


type OpenFoodFactsProduct = {
  product_name?: string;
  image_front_url?: string;
  image_front_small_url?: string;
};

type OpenFoodFactsResponse = {
  product?: OpenFoodFactsProduct;
  status: number;
  status_verbose: string;
};


type LeitorScreenNavigationProp = NavigationProp<RootStackParamList>;


export default function Leitor(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const navigation = useNavigation<LeitorScreenNavigationProp>();

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult): Promise<void> => {
    if (!data || processing) return;
    setProcessing(true);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json: OpenFoodFactsResponse = await res.json();
      const p = json?.product;

      const novoProduto: Produto = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        code: data,
        nome: p?.product_name || 'Produto desconhecido',
        imagem: p?.image_front_url || p?.image_front_small_url || 'https://via.placeholder.com/80',
        quantidade: 1,
      };


      navigation.navigate('despensa', { novoProduto });

    } catch (e) {
      console.error("Falha ao buscar produto:", e);

      navigation.goBack();
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.helperText}>Solicitando permissão da câmera...</Text>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.helperText}>Permissão negada para usar a câmera.</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={{color: '#fff'}}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Escaneie o código de barras</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={processing ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_e', 'upc_a', 'code128', 'itf14', 'qr'],
        }}
      />


      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.helperText}>Aponte para o código</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  topBar: {
    position: 'absolute',
    top: 40, 
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 240,
    height: 160,
    borderWidth: 2,
    borderColor: '#3CB371',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  helperText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowRadius: 4,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: '#3CB371',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
});