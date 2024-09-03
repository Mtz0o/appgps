import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Modal,TouchableOpacity, Animated, Easing 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getRoutes, deleteRoute } from "../services/routes.js";
import { FontAwesome } from "@expo/vector-icons";

export default function ListarRotasScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [opacity] = useState(new Animated.Value(0)); // Estado para a opacidade do fundo
  const [modalY] = useState(new Animated.Value(300)); // Estado para a posição Y do modal

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
  
  function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  const handleDelete = async () => {
    if (routeToDelete) {
      try {
        await deleteRoute(routeToDelete);
        setRoutes(routes.filter((route) => route.objectId !== routeToDelete));
        closeDeleteModal();
      } catch (error) {
        console.error("Erro ao deletar a rota:", error);
      }
    }
  };

  const openDeleteModal = (id) => {
    setRouteToDelete(id);
    setModalVisible(true);
    animateModalIn();
  };

  const closeDeleteModal = () => {
    animateModalOut(() => {
      setModalVisible(false);
      setRouteToDelete(null);
    });
  };

  const animateModalIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalOut = (callback) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalY, {
        toValue: 300,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("ExibirCaminho", {
          name: item.nome,
          path: item.caminho,
          duration: item.duracao,
          createdAt: item.createdAt
        })
      }
    >
      <View style={styles.rotaInfo}>
        <View style={styles.title}>
        <Text style={styles.routeName} numberOfLines={1} ellipsizeMode="tail">
            {item.nome}
          </Text>
        </View>
        <View style={styles.content}>
        <Text style={styles.routeDetails}>Data: {formatarData(item.createdAt)}</Text>
        <Text style={styles.routeDetails}>Duração: {item.duracao}</Text>
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
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.opacityBackground, { opacity }]} />
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalY }] }]}>
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
          </Animated.View>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  opacityBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalContent: {
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
    textAlign: "center",
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
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
