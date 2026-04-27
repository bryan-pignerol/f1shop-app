import React, { useState, useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useRouter, useFocusEffect, Link } from 'expo-router';

const API_URL = `http://172.20.10.7:3001/api/orders`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  const loadOrders = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les commandes'));
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const supprimerCommande = (id: number) => {
    fetch(`${API_URL}/${id}`, { 
      method: 'DELETE' 
    })
      .then(res => {
        if (res.status === 204 || res.status === 200) {
          setOrders(liste => liste.filter(o => o.id !== id));
        } else {
          Alert.alert('Erreur', 'Échec de la suppression');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur serveur'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Commandes
        </Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/create-order')}
        >
          <Text style={styles.addButtonText}>
            + Nouvelle Commande
          </Text>
        </TouchableOpacity>

        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Link href={{ pathname: '/order/[id]', params: { id: item.id } }} asChild>
                <TouchableOpacity style={styles.clickableArea}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.clientName}>
                        {item.Client?.name || item.client?.name || 'Client #' + item.client_id}
                      </Text>
                      <Text style={styles.orderDate}>
                        Date : {item.date ? item.date.split('T')[0] : ''}
                      </Text>
                    </View>
                    <Text style={styles.orderTotal}>
                      {item.total} €
                    </Text>
                  </View>
                  <Text style={styles.detailsHint}>
                    Voir la facture ➔
                  </Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity 
                onPress={() => supprimerCommande(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucune commande enregistrée.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#e10600',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  clickableArea: {
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A3A3C',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e10600',
  },
  orderDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  detailsHint: {
    marginTop: 10,
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#8E8E93',
  },
});
