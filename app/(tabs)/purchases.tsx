import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';

const API_URL = 'http://172.20.10.7:3001/api/purchases';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    purchase_price: '',
    date: new Date().toISOString().split('T')[0],
  });

  const loadPurchases = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPurchases(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les achats'));
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const submitPurchase = () => {
    if (!form.product_id || !form.quantity || !form.purchase_price) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity),
        purchase_price: parseFloat(form.purchase_price),
        date: form.date
      }),
    })
      .then(res => res.json())
      .then(newPurchase => {
        setPurchases(liste => [newPurchase, ...liste]);
        setForm({ 
          product_id: '', 
          quantity: '', 
          purchase_price: '', 
          date: new Date().toISOString().split('T')[0] 
        });
        Alert.alert('Succès', 'Achat enregistré et stock mis à jour');
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de l’ajout de l’achat'));
  };

  const supprimerPurchase = (id: number) => {
    fetch(`${API_URL}/${id}`, { 
      method: 'DELETE' 
    })
      .then(res => {
        if (res.status === 204 || res.status === 200) {
          setPurchases(liste => liste.filter(p => p.id !== id));
        } else {
          Alert.alert('Erreur', 'Impossible de supprimer cet achat');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de la suppression'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Approvisionnement</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="ID du Produit"
            value={form.product_id}
            onChangeText={t => setForm({ ...form, product_id: t })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Quantité"
            value={form.quantity}
            onChangeText={t => setForm({ ...form, quantity: t })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Prix d'achat unitaire"
            value={form.purchase_price}
            onChangeText={t => setForm({ ...form, purchase_price: t })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Date (AAAA-MM-JJ)"
            value={form.date}
            onChangeText={t => setForm({ ...form, date: t })}
            style={styles.input}
          />

          <Button
            title="Enregistrer l'achat"
            onPress={submitPurchase}
            color="#28a745"
          />
        </View>

        <FlatList
          data={purchases}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.purchaseCard}>
              <View style={styles.purchaseInfo}>
                <Text style={styles.productRef}>
                  Produit ID: {item.product_id}
                </Text>
                <Text style={styles.details}>
                  Quantité: {item.quantity} | Prix: {item.purchase_price} €
                </Text>
                <Text style={styles.dateText}>
                  Date: {item.date ? item.date.split('T')[0] : ''}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => supprimerPurchase(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun historique d'achat.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  purchaseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },
  purchaseInfo: {
    flex: 1,
  },
  productRef: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#495057',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 5,
  },
  deleteText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});
