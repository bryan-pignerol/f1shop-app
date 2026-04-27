import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const IP = '172.20.10.7:3001';
const API_ORDERS = `http://${IP}/api/orders`;
const API_ORDER_PRODUCTS = `http://${IP}/api/order_products`;
const API_PRODUCTS = `http://${IP}/api/products`;

export default function OrderInvoicePage() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoiceData = async () => {
    setLoading(true);
    try {
      const [resOrder, resLinks, resProd] = await Promise.all([
        fetch(`${API_ORDERS}/${id}`),
        fetch(API_ORDER_PRODUCTS),
        fetch(API_PRODUCTS)
      ]);

      const dataOrder = await resOrder.json();
      const dataLinks = await resLinks.json();
      const dataProd = await resProd.json();

      setOrder(dataOrder);
      setAllProducts(dataProd);

      const filteredItems = dataLinks.filter(
        (item: any) => item.order_id === parseInt(id as string, 10)
      );
      setOrderItems(filteredItems);

    } catch (error) {
      Alert.alert('Erreur', 'Impossible de générer la facture');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoiceData();
  }, [id]);

  const getProductName = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.name : 'Modèle inconnu';
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
        <View style={styles.invoiceCard}>
          <View style={styles.header}>
            <Text style={styles.brand}>F1 SHOP</Text>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>CLIENT</Text>
              <Text style={styles.value}>
                {order?.Client?.name || order?.client?.name || 'Client #' + order?.client_id}
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.label}>DATE</Text>
              <Text style={styles.value}>
                {order?.date ? order.date.split('T')[0] : ''}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>NUMÉRO DE COMMANDE</Text>
              <Text style={styles.value}>#{id}</Text>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.columnLabel, { flex: 3 }]}>MODÈLE</Text>
            <Text style={[styles.columnLabel, { flex: 1, textAlign: 'right' }]}>QTÉ</Text>
          </View>

          {orderItems.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.productName, { flex: 3 }]}>
                {getProductName(item.product_id)}
              </Text>
              <Text style={[styles.productQty, { flex: 1, textAlign: 'right' }]}>
                x{item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>TOTAL À PAYER</Text>
            <Text style={styles.totalAmount}>{order?.total} €</Text>
          </View>

          <Text style={styles.footerNote}>
            Document généré par le système de gestion F1 Shop.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 15,
  },
  invoiceCard: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 15,
    marginBottom: 25,
  },
  brand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e10600',
    letterSpacing: 1,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
    marginTop: 10,
  },
  columnLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  productName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  productQty: {
    fontSize: 15,
    color: '#333',
  },
  totalSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#e10600',
  },
  footerNote: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#C7C7CC',
    fontStyle: 'italic',
  },
});
