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
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

const IP = '172.20.10.7:3001';
const API_URL_PRODUCTS = `http://${IP}/api/products`;
const API_URL_CATEGORIES = `http://${IP}/api/categories`;

export default function CategoryProductsPage() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: id,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const resCat = await fetch(`${API_URL_CATEGORIES}/${id}`);
      const dataCat = await resCat.json();
      setCategoryName(dataCat.name);

      const resProd = await fetch(API_URL_PRODUCTS);
      const dataProd = await resProd.json();
      
      const filtered = dataProd.filter(
        (p: any) => p.category_id === parseInt(id as string, 10)
      );
      
      setProducts(filtered);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const submitProduct = () => {
    if (!form.name || !form.price) {
      Alert.alert('Erreur', 'Nom et prix obligatoires');
      return;
    }

    const method = editingId === null ? 'POST' : 'PUT';
    const url = editingId === null ? API_URL_PRODUCTS : `${API_URL_PRODUCTS}/${editingId}`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        category_id: parseInt(id as string, 10)
      }),
    })
      .then(res => res.json())
      .then(resData => {
        if (editingId === null) {
          setProducts(liste => [resData, ...liste]);
        } else {
          setProducts(liste =>
            liste.map(p => (p.id === editingId ? resData : p))
          );
        }
        setForm({ name: '', price: '', description: '', image_url: '', category_id: id });
        setEditingId(null);
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de l’enregistrement'));
  };

  const supprimerProduct = (productId: number) => {
    fetch(`${API_URL_PRODUCTS}/${productId}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 204 || res.status === 200) {
          setProducts(liste => liste.filter(p => p.id !== productId));
        } else {
          Alert.alert('Erreur', 'Impossible de supprimer');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de la suppression'));
  };

  const prepareEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price.toString(),
      description: p.description,
      image_url: p.image_url,
      category_id: id,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Monoplaces - {categoryName || 'Chargement...'}
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Modèle de la F1"
            value={form.name}
            onChangeText={t => setForm({ ...form, name: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="Prix"
            value={form.price}
            onChangeText={t => setForm({ ...form, price: t })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={form.description}
            onChangeText={t => setForm({ ...form, description: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="URL Image"
            value={form.image_url}
            onChangeText={t => setForm({ ...form, image_url: t })}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <Button
              title={editingId === null ? "Ajouter F1" : "Enregistrer"}
              onPress={submitProduct}
            />
            {editingId !== null && (
              <Button 
                title="Annuler" 
                color="gray" 
                onPress={() => {
                  setEditingId(null);
                  setForm({ name: '', price: '', description: '', image_url: '', category_id: id });
                }} 
              />
            )}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator 
            size="large" 
            color="#e10600" 
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Link href={{ pathname: '/product/[id]', params: { id: item.id } }} asChild>
                  <TouchableOpacity style={styles.productHeader}>
                    {item.image_url ? (
                      <Image 
                        source={{ uri: item.image_url }} 
                        style={styles.image} 
                      />
                    ) : null}
                    <View style={styles.headerText}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productPrice}>{item.price} €</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
                
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => prepareEdit(item)}>
                    <Text style={styles.editBtn}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => supprimerProduct(item.id)}>
                    <Text style={styles.deleteBtn}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#e10600',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#e10600',
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  editBtn: {
    color: '#007bff',
    marginRight: 25,
    fontWeight: 'bold',
  },
  deleteBtn: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
});
