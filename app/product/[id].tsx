import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = 'http://172.20.10.7:3001/api/products';

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProductDetails = () => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Erreur', 'Impossible de charger les détails');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const supprimerF1 = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment retirer cette monoplace ?',
      [
        { 
          text: 'Annuler', 
          style: 'cancel' 
        },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            fetch(`${API_URL}/${id}`, { 
              method: 'DELETE' 
            })
              .then(res => {
                if (res.status === 204 || res.status === 200) {
                  router.back();
                } else {
                  Alert.alert('Erreur', 'Échec de la suppression');
                }
              })
              .catch(() => Alert.alert('Erreur', 'Erreur serveur'));
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator 
          size="large" 
          color="#e10600" 
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {product?.image_url && (
          <Image 
            source={{ uri: product.image_url }} 
            style={styles.mainImage} 
            resizeMode="cover"
          />
        )}

        <View style={styles.infoSection}>
          <Text style={styles.productName}>
            {product?.name}
          </Text>
          
          <Text style={styles.reference}>
            Référence : #00{product?.id}
          </Text>
          
          <Text style={styles.productPrice}>
            {product?.price} €
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Description technique
          </Text>
          <Text style={styles.description}>
            {product?.description || "Aucune description disponible."}
          </Text>
          
          <View style={styles.footerButtons}>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={supprimerF1}
            >
              <Text style={styles.deleteButtonText}>
                Supprimer du catalogue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  infoSection: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reference: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  productPrice: {
    fontSize: 24,
    color: '#e10600',
    fontWeight: '700',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  footerButtons: {
    marginTop: 20,
    paddingBottom: 40,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
