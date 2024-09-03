import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline } from 'react-native-maps';

export default function ExibirCaminho({ route }) {
  const { name, path, duration, createdAt } = route.params;

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

  function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  const numeroDeCoordenadas = contarCoordenadas(path);
  const duracaoEmSegundos = converterDuracaoParaSegundos(duration);
  const mediaMetrosPorSegundo = calcularMediaMetrosPorSegundo(numeroDeCoordenadas, duracaoEmSegundos);

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
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        mapType={"terrain"}
      >
        <Polyline
          coordinates={path}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.overlayTop}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.date}>{formatarData(createdAt)}</Text>
      </View>

      <View style={styles.overlayBottom}>
        <Text style={styles.duration}>Duração: {duration}</Text>
        <Text style={styles.average}>Vel Média:{mediaMetrosPorSegundo.toFixed(2)} m/s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 5,
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 5,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    textAlign: "center",
  },
  duration: {
    fontSize: 16,
    fontWeight: "bold",
  },
  average: {
    fontSize: 16,
  },
});