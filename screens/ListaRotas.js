import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRoutes, deleteRoute } from "../services/routes.js";
import { FontAwesome } from "@expo/vector-icons";

export default function ListarRotasScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  const fetchRoutes = async () => {
    try {
      const fetchedRoutes = await getRoutes();
      const sortedRoutes = fetchedRoutes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRoutes(sortedRoutes);
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoutes();
    }, [])
  );

  const handleDelete = async () => {
    if (routeToDelete) {
      try {
        await deleteRoute(routeToDelete);
        setRoutes(routes.filter((route) => route.objectId !== routeToDelete));
        setModalVisible(false);
        setRouteToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar a rota:", error);
      }
    }
  };

  const openDeleteModal = (id) => {
    setRouteToDelete(id);
    setModalVisible(true);
  };

  const closeDeleteModal = () => {
    setModalVisible(false);
    setRouteToDelete(null);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("ExibirCaminho", {
          name: item.nome,
          date: item.data,
          path: item.caminho,
          duration: item.duracao,
        })
      }
    >
      <View style={styles.rotaInfo}>
        <View style={styles.title}>
          <Text style={styles.routeName}>{item.nome}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.routeDetails}>Duração: {item.duracao}</Text>
          <Text style={styles.routeDetails}>Data: {item.data}</Text>
        </View>
      </View>
      <Pressable style={styles.iconButton} onPress={() => openDeleteModal(item.objectId)}>
        <FontAwesome name="trash" size={24} color="red" />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.objectId}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>Você tem certeza que deseja excluir esta rota?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeDeleteModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rotaInfo: {
    flexDirection: "column",
    flex: 1,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "space-between",
    justifyContent: "space-between",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  routeName: {
    fontSize: 24,
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: "70%",
  },
  routeDetails: {
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
});

