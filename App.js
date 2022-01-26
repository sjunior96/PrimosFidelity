import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Imports das telas
import LoginScreen from './src/Pages/Login/Login';
import HomeScreen from './src/Pages/Home/Home';

import firebase from './src/Services/firebaseConnection';

const Stack = createNativeStackNavigator();

const App = ({ navigation }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			setIsLoggedIn(true);
			setIsLoading(false);
		}
		else {
			setIsLoggedIn(false);
			setIsLoading(false);
		}
	});

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Home" component={HomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;