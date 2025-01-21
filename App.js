import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Feather as Icon } from "@expo/vector-icons";

export default function App() {
  const [data, setData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState("btcusdt");
  const [isLoading, setIsLoading] = useState(false);

  // Lista de criptomoedas
  const cryptoList = [
    "btcusdt",
    "ethusdt",
    "bnbusdt",
    "bnbbtc",
    "xrpbtc",
    "adausdt",
    "dogeusdt",
    "solusdt",
    "dotusdt",
    "avaxusdt",
    "linkusdt",
    "maticusdt",
    "ltcusdt",
    "usdtbnb",
  ];

  useEffect(() => {
    let socket;
    setIsLoading(true);

    // Conexão WebSocket
    try {
      socket = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedSymbol}@ticker`);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setData(message);
        setIsLoading(false);
      };

      socket.onerror = () => {
        alert("Erro na conexão WebSocket. Verifique sua internet ou o símbolo.");
        setIsLoading(false);
      };

      // Fecha a conexão ao desmontar
      return () => {
        socket.close();
      };
    } catch (error) {
      alert("Erro ao conectar: " + error.message);
      setIsLoading(false);
    }
  }, [selectedSymbol]);

  const formatNumber = (value) => {
    if (!value) return "N/A"; // Retorna "N/A" se o valor for null ou undefined
    const number = parseFloat(value);
    return isNaN(number) ? "N/A" : number.toFixed(6); // Formata para 4 casas decimais
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CryptoMonitor</Text>

      {/* Seleção de criptomoeda */}
      <Picker
        selectedValue={selectedSymbol}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedSymbol(itemValue)}
      >
        {cryptoList.map((crypto) => (
          <Picker.Item key={crypto} label={crypto.toUpperCase()} value={crypto} />
        ))}
      </Picker>

      {/* Informações da criptomoeda */}
      <View style={styles.infoContainer}>
        <Text style={styles.heading}>Informações:</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : (
          <>
            <View style={styles.row}>
              <Icon name="dollar-sign" size={20} color="#4CAF50" />
              <Text style={styles.label}>Último preço:</Text>
              <Text style={styles.value}>{formatNumber(data.c)}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="bar-chart" size={20} color="#2196F3" />
              <Text style={styles.label}>Variação (%):</Text>
              <Text style={styles.value}>{data.P || "N/A"}%</Text>
            </View>
            <View style={styles.row}>
              <Icon name="trending-up" size={20} color="#FF5722" />
              <Text style={styles.label}>Alta:</Text>
              <Text style={styles.value}>{data.h || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="trending-down" size={20} color="#E91E63" />
              <Text style={styles.label}>Baixa:</Text>
              <Text style={styles.value}>{data.l || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="pie-chart" size={20} color="#FFC107" />
              <Text style={styles.label}>Preço médio:</Text>
              <Text style={styles.value}>{data.w || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="layers" size={20} color="#9C27B0" />
              <Text style={styles.label}>Volume negociado:</Text>
              <Text style={styles.value}>{formatNumber(data.v)}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="list" size={20} color="#00BCD4" />
              <Text style={styles.label}>Total de trades:</Text>
              <Text style={styles.value}>{data.n || "N/A"}</Text>
            </View>
          </>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60,
    color: "#333",
    marginTop: 25
  },
  picker: {
    height: 80,
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    overflow: 'hidden',

  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#555",
  },
  value: {
    fontSize: 16,
    marginLeft: "auto",
    fontWeight: "600",
    color: "#222",
  },
});
