// screens/ExibirCaminho.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline } from 'react-native-maps';

export default function ExibirCaminho({ route }) {
  const { name, date, path, duration } = route.params;

  function contarCoordenadas(caminho) {
    return caminho.length;
  }

  function converterDuracaoParaSegundos(duracao) {
    const [horas, minutos, segundos] = duracao.split(':').map(Number);
    return (horas * 3600) + (minutos * 60) + segundos;
  }

  function calcularMediaMetrosPorSegundo(numeroDeCoordenadas, duracaoEmSegundos) {
    if (duracaoEmSegundos === 0) {
      return 0; // Evitar divisão por zero
    }
    return numeroDeCoordenadas / duracaoEmSegundos;
  }

  const numeroDeCoordenadas = contarCoordenadas(path);
  const duracaoEmSegundos = converterDuracaoParaSegundos(duration);
  const mediaMetrosPorSegundo = calcularMediaMetrosPorSegundo(numeroDeCoordenadas, duracaoEmSegundos);

  // Define a região inicial do mapa com base na primeira coordenada do array path
  const initialRegion = path.length > 0 ? {
    latitude: path[0].latitude,
    longitude: path[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: -23.563987,
    longitude: -46.653929,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.date}>Data: {date}</Text>
      <Text style={styles.duration}>Duração: {duration}</Text>
      <Text style={styles.average}>Média de metros por segundo: {mediaMetrosPorSegundo.toFixed(2)}</Text>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Polyline
          coordinates={path}
          strokeColor="#000" // cor do caminho
          strokeWidth={3} // espessura da linha
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 16,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  average: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});
