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
} from 'react-native';
import { Link } from 'expo-router';

const API_URL = 'http://172.20.10.7:3001/api/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    image_url: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadCategories = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les catégories'));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const submitCategory = () => {
    if (!form.name) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    const method = editingId === null ? 'POST' : 'PUT';
    const url = editingId === null ? API_URL : `${API_URL}/${editingId}`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(resData => {
        if (editingId === null) {
          setCategories(liste => [resData, ...liste]);
        } else {
          setCategories(liste =>
            liste.map(c => (c.id === editingId ? resData : c))
          );
        }
        setForm({ name: '', image_url: '' });
        setEditingId(null);
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de l’enregistrement'));
  };

  const supprimerCategory = (id: number) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 204 || res.status === 200) {
          setCategories(liste => liste.filter(c => c.id !== id));
        } else {
          Alert.alert('Erreur', 'Impossible de supprimer');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de la suppression'));
  };

  const prepareEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      image_url: c.image_url,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>F1 Shop - Catégories</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nom de la catégorie"
            value={form.name}
            onChangeText={t => setForm({ ...form, name: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="URL de l'image"
            value={form.image_url}
            onChangeText={t => setForm({ ...form, image_url: t })}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <Button
              title={editingId === null ? "Ajouter" : "Enregistrer"}
              onPress={submitCategory}
            />
            {editingId !== null && (
              <Button 
                title="Annuler" 
                color="gray" 
                onPress={() => {
                  setEditingId(null);
                  setForm({ name: '', image_url: '' });
                }} 
              />
            )}
          </View>
        </View>

        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Link href={{ pathname: '/category/[id]', params: { id: item.id } }} asChild>
                <TouchableOpacity style={styles.categoryInfo}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                  ) : null}
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              </Link>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => prepareEdit(item)}>
                  <Text style={styles.editBtn}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => supprimerCategory(item.id)}>
                  <Text style={styles.deleteBtn}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#e10600',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  categoryName: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  editBtn: {
    color: '#007bff',
    marginRight: 20,
    fontWeight: '600',
  },
  deleteBtn: {
    color: '#dc3545',
    fontWeight: '600',
  },
});
