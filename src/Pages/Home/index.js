import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Modal, ActivityIndicator, Image, FlatList } from 'react-native';
import firebase from '../../Services/firebaseConnection';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import AwesomeAlert from 'react-native-awesome-alerts';

const { width, height } = Dimensions.get('window');

export default function Home() {
    const [user, setUser] = useState([]);
    const [stamps, setStamps] = useState([]);
    const [modalLoadingVisible, setModalLoadingVisible] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);

    function openSelectedProfile() {
        let newStamps = [];
        for (let index = 1; index <= 4; index++) {
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

    async function removeGift(userKey) {
        let newGiftsQuantity = user.giftsQuantity - 1;
        firebase.database().ref('users').child(userKey).update({
            giftsQuantity: newGiftsQuantity,
            hasGiftRemovalRequest: "false"
        })
            .then((success) => {
                alert("Brinde resgatado com sucesso!");
            });
    }

    async function removeGiftRemovalRequest(userKey) {
        firebase.database().ref("users").child(userKey).update({
            hasGiftRemovalRequest: "false"
        })
            .then((success) => {
                alert("Resgate do brinde cancelado com sucesso!");
            });
    }

    function getUser() {
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).on('value', (snapshot) => {
            let list = {
                key: uid,
                email: snapshot.val().email,
                name: snapshot.val().name,
                hasGiftRemovalRequest: snapshot.val().hasGiftRemovalRequest,
                giftsQuantity: snapshot.val().giftsQuantity,
                stampsQuantity: snapshot.val().stampsQuantity,
                clientType: snapshot.val().clientType
            };
            setAlertVisible(snapshot.val().hasGiftRemovalRequest === "true" ? true : false);
            setUser(list);
            setModalLoadingVisible(false);
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
                        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: 15, justifyContent: "center" }}
                        data={stamps}
                        renderItem={({ item }) => (
                            // Componente que será renderizado, para cada dispositivo cadastrado
                            <>
                                {item.value > user.stampsQuantity ?
                                    (
                                        <View style={{ alignItems: "center", justifyContent: "center", width: 59, height: 59, backgroundColor: "#000", borderRadius: 100, marginRight: 1, marginBottom: 3, opacity: 0.2 }}>
                                            <Image style={{ width: 49, height: 49 }} source={require('../../assets/logo.png')}></Image>
                                        </View>
                                    )
                                    :
                                    (
                                        <View style={{ alignItems: "center", justifyContent: "center", width: 59, height: 59, backgroundColor: "#000", borderRadius: 100, marginRight: 1, marginBottom: 3, }}>
                                            <Image style={{ width: 49, height: 49 }} source={require('../../assets/logo.png')}></Image>
                                        </View>
                                    )

                                }
                            </>
                        )}
                        keyExtractor={item => item.id}
                    >

                    </FlatList>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        {/*<Icon name="star" size={130} color={"#000"}></Icon>*/}
                        <View style={{ backgroundColor: "#000", borderRadius: 100, height: 175, width: 175, alignItems: "center", justifyContent: "center", paddingTop: 10 }}>
                            <Image style={{ width: 150, height: 150 }} source={require('../../assets/logo.png')}></Image>
                        </View>
                        <Text style={{ fontSize: 35, height: 95, textAlignVertical: "bottom" }}>x{user.giftsQuantity}</Text>
                    </View>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalLoadingVisible}
            >
                <View style={{ height: '100%', width: '100%', backgroundColor: '#000', alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            </Modal>

            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title="Atenção"
                message={"A loja está tentando dar baixa em um brinde de sua conta, confirme se você está fazendo uso do seu brinde!"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                showCancelButton={true}
                cancelText="Cancelar"
                confirmText="Resgatar"
                confirmButtonColor="#DD6B55"
                cancelButtonColor="#000"
                onConfirmPressed={() => {
                    removeGift(user.key);
                    setAlertVisible(false);
                }}
                onCancelPressed={() => {
                    removeGiftRemovalRequest(user.key);
                    setAlertVisible(false);
                }}
                cancelButtonStyle={{ width: 100, height: 50, justifyContent: "center", alignItems: "center" }}
                confirmButtonStyle={{ width: 100, height: 50, justifyContent: "center", alignItems: "center" }}
                confirmButtonTextStyle={{ fontSize: 18 }}
                cancelButtonTextStyle={{ fontSize: 18 }}
                titleStyle={{ fontSize: 22 }}
                messageStyle={{ fontSize: 18 }}
            />
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