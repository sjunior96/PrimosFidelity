import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Modal, FlatList } from 'react-native';
import firebase from '../../Services/firebaseConnection';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Home() {
    const [user, setUser] = useState([]);
    const [stamps, setStamps] = useState([]);

    function openSelectedProfile() {
        let newStamps = [];
        for (let index = 1; index <= 10; index++) {
            let list = {
                key: index,
                value: index
            };
            newStamps.push(list);
            //setStamps(oldArray => [...oldArray, 0]);
        }
        setStamps(newStamps);
        //alert(JSON.stringify(stamps));
    }

    function getUser() {
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).on('value', (snapshot) => {
            let list = {
                key: uid,
                email: snapshot.val().email,
                name: snapshot.val().name,
                giftsQuantity: snapshot.val().giftsQuantity,
                stampsQuantity: snapshot.val().stampsQuantity,
                clientType: snapshot.val().clientType
            };
            setUser(list);
        });
    }

    useEffect(() => {
        getUser();
        openSelectedProfile();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.modalView}>
                <View style={{ padding: 15 }}>
                    <Text style={styles.selectedUserName}>{user.name}</Text>
                    <Text style={styles.selectedUserEmail}>{user.email}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: '70%' }}>
                            <Text style={[styles.selectedUserStampsQuantity, { marginTop: 15 }]}>Carimbos acumulados: </Text>
                        </View>

                        <View style={{ width: '30%', alignItems: "flex-end" }}>
                            <Text style={[styles.selectedUserStampsQuantity, styles.badge]}>{user.stampsQuantity}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: '70%' }}>
                            <Text style={[styles.selectedUserGiftsQuantity, { marginTop: 15 }]}>Brindes acumulados: </Text>
                        </View>
                        <View style={{ width: '30%', alignItems: "flex-end" }}>
                            <Text style={[styles.selectedUserGiftsQuantity, styles.badge]}>{user.giftsQuantity}</Text>
                        </View>
                    </View>
                    <FlatList
                        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: 15 }}
                        data={stamps}
                        renderItem={({ item }) => (
                            // Componente que será renderizado, para cada dispositivo cadastrado
                            <View style={{ alignItems: "center" }}>
                                {item.value > user.stampsQuantity ?
                                    (
                                        <Icon name="star-outline" size={70} color={"#000"}></Icon>
                                    )
                                    :
                                    (
                                        <Icon name="star" size={70} color={"#000"}></Icon>
                                    )

                                }
                            </View>
                        )}
                        keyExtractor={item => item.id}
                    >

                    </FlatList>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="star" size={130} color={"#000"}></Icon>
                        <Text style={{ fontSize: 35, height: 95, textAlignVertical: "bottom" }}>x{user.giftsQuantity}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchCard: {
        height: '10%',
        width: '90%',
        borderRadius: 10,
        borderWidth: 0.5,
        paddingLeft: 25,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center'
    },
    modalView: {
        height: '100%',
        width: '100%',
        backgroundColor: "#FFF"
    },
    selectedUserName: {
        fontSize: 25
    },
    selectedUserEmail: {
        fontSize: 20
    },
    selectedUserStampsQuantity: {
        fontSize: 18
    },
    selectedUserGiftsQuantity: {
        fontSize: 18
    },
    badge: {
        color: "#FFF",
        fontWeight: "bold",
        marginTop: 15,
        width: 50,
        borderRadius: 100,
        textAlign: "center",
        //backgroundColor: "#428BCA"
        backgroundColor: "#000"
    },
    container: {
        height: height,
        width: width,
        backgroundColor: '#FFF',
        paddingTop: 25,
        alignItems: "center"
    },
    usersButton: {
        width: width * 0.9,
        height: 100,
        borderBottomWidth: 1,
        backgroundColor: '#FFF',
        paddingLeft: 25
    },
    usersText: {
        color: '#000',
        fontSize: 17,
        fontWeight: "bold"
    }
});