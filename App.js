import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text} from 'react-native';
import { useState, useEffect } from 'react';
import { Input } from 'react-native-elements';
import {Feather as Icon} from '@expo/vector-icons'


export default function App() {
  const [data, setData] = useState({});
  const [text, setText] = useState('BTCUSDT');
  const [symbol, setSymbol] = useState('btcusdt');
  const [socket, setSocket] = useState(null);  // Para armazenar o WebSocket

  // Efeito para gerenciar a conexão WebSocket
  useEffect(() => {
    if (socket) {
      // Fecha o WebSocket anterior antes de abrir um novo
      socket.close();
    }

    // Cria a nova conexão WebSocket com o símbolo atualizado
    const newSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    // Evento para receber mensagens
    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    // Evento de erro
    newSocket.onerror = (event) => {
      alert('Erro na conexão WebSocket: ' + event.message);
    };

    // Armazena o WebSocket atual para poder fechá-lo depois
    setSocket(newSocket);

    // Fecha a conexão ao desmontar o componente
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [symbol]);  

  const searchButton = <Icon.Button
    name="search"
    size={24}
    color="black"
    backgroundColor="transparent"
    onPress={() => {setSymbol(text.toLowerCase())}}
  />

  return (
    <View style={styles.container}>
      <Text h1>CryptoMonitor</Text>
      <Input
        autoCapitalize="characters"
        leftIcon={<Icon name="dollar-sign" size={24} color="black"/>}
        rightIcon={searchButton}
        value={text}
        onChangeText={setText}
      />
      <Text style={styles.rotulo}>Preço Atual:</Text>
      <Text style={styles.conteudo}>{data.c}</Text>
      <Text style={styles.rotulo}>Variação:</Text>
      <Text style={styles.conteudo}>{data.p}%</Text>
      <Text style={styles.rotulo}>Volume:</Text>
      <Text style={styles.conteudo}>{data.v}%</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 40,
    margin:20,
    alignContent: 'center'
  },
  rotulo:{
    fontWeight:'bold',
    fontSize:18
  },
  conteudo:{
    fontSize:20
  }
});
