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

const API_URL = 'http://172.20.10.7:3001/api/clients';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadClients = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => Alert.alert('Erreur', 'Impossible de charger les clients'));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const submitClient = () => {
    if (!form.name || !form.email) {
      Alert.alert('Erreur', 'Nom et Email obligatoires');
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
          setClients(liste => [resData, ...liste]);
        } else {
          setClients(liste =>
            liste.map(c => (c.id === editingId ? resData : c))
          );
        }
        setForm({ name: '', email: '', phone: '' });
        setEditingId(null);
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de l’enregistrement'));
  };

  const supprimerClient = (id: number) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 204 || res.status === 200) {
          setClients(liste => liste.filter(c => c.id !== id));
        } else {
          Alert.alert('Erreur', 'Impossible de supprimer ce client');
        }
      })
      .catch(() => Alert.alert('Erreur', 'Erreur lors de la suppression'));
  };

  const prepareEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestion des Clients</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Nom complet"
            value={form.name}
            onChangeText={t => setForm({ ...form, name: t })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={form.email}
            onChangeText={t => setForm({ ...form, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Téléphone"
            value={form.phone}
            onChangeText={t => setForm({ ...form, phone: t })}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <Button
              title={editingId === null ? "Ajouter Client" : "Mettre à jour"}
              onPress={submitClient}
              color="#e10600"
            />
            {editingId !== null && (
              <Button
                title="Annuler"
                color="#666"
                onPress={() => {
                  setEditingId(null);
                  setForm({ name: '', email: '', phone: '' });
                }}
              />
            )}
          </View>
        </View>

        <FlatList
          data={clients}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.clientCard}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.clientDetails}>{item.email}</Text>
                <Text style={styles.clientDetails}>{item.phone}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={() => prepareEdit(item)}
                  style={styles.editButton}
                >
                  <Text style={styles.editText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => supprimerClient(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun client enregistré.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
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
    borderColor: '#DEE2E6',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  clientCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 14,
    color: '#6C757D',
  },
  actionButtons: {
    alignItems: 'flex-end',
  },
  editButton: {
    marginBottom: 10,
  },
  editText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 5,
  },
  deleteText: {
    color: '#DC3545',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#ADB5BD',
    marginTop: 50,
    fontSize: 16,
  },
});
