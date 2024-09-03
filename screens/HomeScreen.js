import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { createRoute } from '../services/routes.js';
import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

// Carregar a imagem usando expo-asset
const routeImage = Asset.fromModule(require('../assets/Route2.png')).uri;

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [path, setPath] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const startRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    setIsRecording(true);
    startTimer();

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
      },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        setPath((prevPath) => [...prevPath, { latitude, longitude }]);
      }
    );
  };

  const stopRecording = async () => {
    setIsRecording(false);
    stopTimer();

    await createRoute(name, path, formatTime(timer));
    setPath([]);
    setName('');
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: routeImage }} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Nome da rota"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <FontAwesome name={isRecording ? 'pause' : 'play'} size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Fundo claro
  },
  image: {
    marginTop: 0,
    width: '100%', // Ajuste o tamanho conforme necessário
    height: '22%', // Ajuste o tamanho conforme necessário
    marginBottom: 50,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 18,
  },
  timer: {
    fontSize: 36,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#1e90ff', // Azul vibrante
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
