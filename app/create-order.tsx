import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const IP = '172.20.10.7:3001';
const API_CLIENTS = `http://${IP}/api/clients`;
const API_PRODUCTS = `http://${IP}/api/products`;
const API_ORDERS = `http://${IP}/api/orders`;
const API_ORDER_PRODUCTS = `http://${IP}/api/order_products`;

export default function CreateOrderPage() {
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const [resClients, resProducts] = await Promise.all([
        fetch(API_CLIENTS),
        fetch(API_PRODUCTS)
      ]);
      const dataClients = await resClients.json();
      const dataProducts = await resProducts.json();
      setClients(dataClients);
      setProducts(dataProducts);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleProduct = (product: any) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedProducts.filter(p => p.id !== product.id);
    } else {
      newSelection = [...selectedProducts, product];
    }

    setSelectedProducts(newSelection);
    const newTotal = newSelection.reduce((sum, p) => sum + parseFloat(p.price), 0);
    setTotal(newTotal);
  };

  const submitOrder = async () => {
    if (!selectedClientId || selectedProducts.length === 0) {
      Alert.alert('Erreur', 'Veuillez choisir un client et au moins une F1');
      return;
    }

    try {
      const orderResponse = await fetch(API_ORDERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClientId,
          date: new Date().toISOString().split('T')[0],
          total: total,
        }),
      });

      const newOrder = await orderResponse.json();

      for (const prod of selectedProducts) {
        await fetch(API_ORDER_PRODUCTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: newOrder.id,
            product_id: prod.id,
            quantity: 1,
          }),
        });
      }

      Alert.alert('Succès', 'Commande enregistrée avec succès');
      router.back();
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la création de la commande');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Nouvelle commande</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Sélectionner le Client</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listHorizontal}>
            {clients.map(client => (
              <TouchableOpacity
                key={client.id}
                onPress={() => setSelectedClientId(client.id)}
                style={[
                  styles.clientChip,
                  selectedClientId === client.id && styles.clientChipSelected
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedClientId === client.id && styles.chipTextSelected
                ]}>
                  {client.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionProducts}>
          <Text style={styles.sectionTitle}>2. Sélectionner les Monoplaces</Text>
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedProducts.find(p => p.id === item.id);
              return (
                <TouchableOpacity
                  onPress={() => toggleProduct(item)}
                  style={[
                    styles.productCard,
                    isSelected && styles.productCardSelected
                  ]}
                >
                  <View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price} €</Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.totalText}>Total : {total.toFixed(2)} €</Text>
          <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
            <Text style={styles.submitButtonText}>Confirmer la Vente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e10600',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionProducts: {
    flex: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  listHorizontal: {
    flexDirection: 'row',
  },
  clientChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  clientChipSelected: {
    backgroundColor: '#e10600',
    borderColor: '#e10600',
  },
  chipText: {
    color: '#333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  productCardSelected: {
    borderColor: '#e10600',
    backgroundColor: '#FFF5F5',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  checkMark: {
    fontSize: 20,
    color: '#e10600',
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#e10600',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
