import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ToastAndroid, ActivityIndicator, TextInput, TouchableOpacity, Modal, Picker, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '../../Services/firebaseConnection';

import Swipeable from 'react-native-gesture-handler/Swipeable';

const { width, height } = Dimensions.get('window');

export default function Promos() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoadingVisible, setModalLoadingVisible] = useState(true);
    const [promoStatus, setPromoStatus] = useState("Ativo");
    const [title, setTitle] = useState("");
    const [value, setValue] = useState(parseFloat(0).toFixed(2).toString().replace(".", ","));
    const [description, setDescription] = useState("");
    const [promos, setPromos] = useState([]);
    const [selectedPromoUID, setSelectedPromoUID] = useState("");
    const [filteredPromos, setFilteredPromos] = useState([]);
    const [searchTextPromo, setSearchTextPromo] = useState("");

    const showToastWithGravity = (message) => { //Componente para exibir o Toast
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    };


    async function openSelectedPromo(promoUID) {
        await firebase.database().ref('promos').child(promoUID).on("value", (snapshot) => {
            setSelectedPromoUID(promoUID);
            setPromoStatus(snapshot.val().promoStatus);
            setDescription(snapshot.val().description);
            setValue(parseFloat(snapshot.val().value).toFixed(2).toString().replace(".", ","));
            setTitle(snapshot.val().title);
        });

        setModalVisible(true);
    }

    function clearForm() {
        setPromoStatus("Ativo");
        setSelectedPromoUID("");
        setTitle("");
        setValue(parseFloat(0).toFixed(2).toString().replace(".", ","));
        setDescription("");
        setModalVisible(false);
    }

    async function getPromos() {
        setModalLoadingVisible(true);
        firebase.database().ref('promos').orderByChild("value").on("value", (snapshot) => {
            setPromos([]);
            snapshot.forEach((childItem) => {
                if (childItem.val().promoStatus == "Ativo") {
                    let list = {
                        key: childItem.key,
                        title: childItem.val().title,
                        value: parseFloat(childItem.val().value).toFixed(2),
                        description: childItem.val().description,
                        promoStatus: childItem.val().promoStatus
                    };
                    setPromos(oldArray => [...oldArray, list]);
                    setModalLoadingVisible(false);
                }
            });
        });
    }

    function searchPromo() {
        setFilteredPromos([]);
        promos.forEach((promo) => {
            if (promo.title.toUpperCase().includes(searchTextPromo.toUpperCase()) || promo.title.toUpperCase() == searchTextPromo.toUpperCase()) {
                setFilteredPromos(oldArray => [...oldArray, promo]);
            }
        });
    }

    function clearFilteredPromos() {
        setFilteredPromos([]);
        setSearchTextPromo("");
    }

    useEffect(() => {
        getPromos();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.promosTitle}>Serviços</Text>
            <View style={{ width: '90%', height: 60, alignItems: "center", justifyContent: "center", flexDirection: "row", borderWidth: 1, borderRadius: 7.5, paddingLeft: 10, marginBottom: 25 }}>
                <View style={{ width: '70%' }}>
                    <TextInput value={searchTextPromo} placeholder="Buscar Promoção..." style={{ fontSize: 18 }} onChangeText={(searchTextPromo) => { setSearchTextPromo(searchTextPromo); }}></TextInput>
                </View>
                <TouchableOpacity style={{ width: '15%', alignItems: "center" }} onPress={() => { searchPromo(); }}>
                    <Icon name="search-outline" size={40} color={"#000"}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '15%', alignItems: "center" }} onPress={() => { clearFilteredPromos(); }}>
                    <Icon name="return-down-back-outline" size={40} color={"#000"}></Icon>
                </TouchableOpacity>
            </View>

            <View style={{ width: '90%', alignItems: "flex-end" }}>
                <Text style={{ fontSize: 16 }}>Foram encontrados <Text style={{ fontWeight: "bold" }}>{filteredPromos.length > 0 ? filteredPromos.length : promos.length}</Text> serviços</Text>
            </View>

            <ScrollView>
                <FlatList
                    style={{ height: height - 300 }}
                    contentContainerStyle={{ width: width, paddingLeft: 20 }}
                    data={filteredPromos.length > 0 ? filteredPromos : promos}
                    renderItem={({ item }) => (
                        // Componente que será renderizado para cada usuário cadastrado
                        <TouchableOpacity style={styles.promosButton} onPress={() => { openSelectedPromo(item.key); }}>
                            <Text style={[styles.usersText, { fontSize: 20, width: '70%' }]}>{item.title}</Text>
                            <Text style={[styles.usersText, { color: "#428BCA", textAlign: "right", width: '30%' }]}>R$ {parseFloat(item.value).toFixed(2).toString().replace(".", ",")}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View style={{ flex: 1, height: 1, backgroundColor: '#DDD' }}></View>}
                />
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={{ height: '50%', backgroundColor: "#FFF", marginTop: '40%', width: '90%', borderRadius: 25 }}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity style={{ width: '100%', alignItems: "center" }} onPress={() => { clearForm(); }}>
                                <Icon name="arrow-down-circle-outline" size={50} color={"#000"}></Icon>
                            </TouchableOpacity>
                            {selectedPromoUID.length > 0 ?
                                (<Text style={{ fontSize: 25, width: '100%', textAlign: "center" }}>Detalhes do Serviço</Text>)
                                :
                                (<></>)
                            }
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.serviceText}>Serviço: {title}</Text>
                            <Text style={styles.serviceText}>Valor: {value}</Text>
                            {description !== "" && <Text style={styles.serviceText}>Descrição: {description}</Text>}
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalLoadingVisible}
            >
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#000',
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height - 50,
        backgroundColor: "#FFF",
        alignItems: "center"
    },
    promosTitle: {
        fontSize: 25,
        width: '90%',
        paddingTop: 15,
        marginBottom: 15
    },
    modalContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: "#000",
        alignItems: "center"
    },
    modalHeader: {
        height: '30%',
        width: '100%',
        alignItems: "center"
    },
    modalBody: {
        height: '70%',
        width: '100%',
        alignItems: "center",
    },
    input: {
        width: '90%',
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 7.5,
        paddingLeft: 10,
        marginBottom: 25,
        fontSize: 18
    },
    saveButton: {
        width: 200,
        height: 50,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25
    },
    promosButton: {
        width: '90%',
        height: 30,
        backgroundColor: '#FFF',
        flexDirection: "row",
        alignItems: "center",
        /* paddingHorizontal: 10,
        paddingVertical: 25 */
    },
    usersText: {
        color: '#000',
        fontSize: 20,
        fontWeight: "bold"
    },
    deleteButton: {
        backgroundColor: "red",
        left: -10,
        width: 60,
        borderRadius: 5,
        height: '100%',
        alignItems: "center",
        justifyContent: "center"
    },
    rightActionButton: {
        height: '100%',
        padding: 20,
        alignItems: "center",
        backgroundColor: '#FF0000',
        justifyContent: "center"
    },
    serviceText: {
        paddingLeft: 25,
        width: "100%",
        fontSize: 20
    }
});