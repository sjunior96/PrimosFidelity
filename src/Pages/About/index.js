import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import firebase from '../../Services/firebaseConnection';
import Icon from 'react-native-vector-icons/Ionicons';

export default function About() {

    async function logout() {
        await firebase.auth().signOut();
    }

    return (
        <View style={styles.container}>
            <View style={{ height: '25%', width: '100%', alignItems: "center" }}>
                <Image source={require('../../assets/logo.png')}></Image>
            </View>
            <View style={{ width: '90%', alignItems: "center", height: '55%', justifyContent: "center" }}>
                <Text style={styles.title}>Quem somos? </Text>
                <Text style={styles.bodyText}>
                    Dois primos apaixonados por carros, iniciamos um lava rápido na rua,
                    com o intuito de ter uma renda extra, mas no percurso nos apaixonamos
                    também pelo poder de transformar a estética de um automóvel. Hoje temos
                    nosso espaço seguro e trabalhamos com todo o cuidado, carinho e esforço
                    para entregar não só um serviço de qualidade, mas também valor e
                    conforto aos nossos clientes.
                </Text>
                <Text style={styles.title}>Contato </Text>
                <View style={{ flexDirection: "row" }}>
                    <Icon name="logo-whatsapp" size={30} color={"#FFF"}></Icon>
                    <Text
                        style={[styles.bodyText, { fontSize: 22 }]}
                        onPress={() => {
                            Linking.canOpenURL(url).then(supported => {
                                if (supported) {
                                    Linking.openURL("https://api.whatsapp.com/send?1=pt_BR&phone=5561986655614");
                                } else {
                                    console.log('Don\'t know how to open URI: https://api.whatsapp.com/send?1=pt_BR&phone=5561986655614');
                                }
                            });
                        }}> (61) 98665-5614
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{height: 30, width: 30, backgroundColor: "#000"}}></View>
                    <Text style={[styles.bodyText, { fontSize: 22 }]}> (61) 98363-3400</Text>
                </View>
            </View>
            <View style={{ width: '100%', alignItems: "flex-end" }}>
                <TouchableOpacity style={styles.exitButton} onPress={() => { logout() }}>
                    <Icon name="log-out-outline" size={40} color={"#000"}></Icon>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: "#000", alignItems: "center"
    },
    exitButton: {
        //backgroundColor: '#d9534f',
        backgroundColor: "#FFF",
        width: 75,
        height: 75,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        marginRight: 15,
        marginBottom: 15,
        alignSelf: "flex-end"
    },
    exitButtonText: {
        color: '#FFF',
        fontSize: 18
    },
    title: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 15
    },
    bodyText: {
        color: "#FFF", textAlign: "justify", fontSize: 17
    }
})