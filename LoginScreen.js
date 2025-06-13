import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(userCredential => {
        setLoading(false);
        Alert.alert('Success', `Welcome back, ${userCredential.user.email}`);
        navigation.replace('Products'); // Navigate after login
      })
      .catch(error => {
        setLoading(false);
        let message = 'Something went wrong. Please try again.';
        if (error.code === 'auth/user-not-found') {
          message = 'No user found with this email.';
        } else if (error.code === 'auth/wrong-password') {
          message = 'Incorrect password.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        }
        Alert.alert('Login Error', message);
      });
  };

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .then(userCredential => {
        setLoading(false);
        Alert.alert('Success', `Account created for ${userCredential.user.email}`);
        navigation.replace('Products'); // Navigate after signup
      })
      .catch(error => {
        setLoading(false);
        let message = 'Something went wrong. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
          message = 'That email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (error.code === 'auth/weak-password') {
          message = 'Password is too weak.';
        }
        Alert.alert('Signup Error', message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#999' }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#34a853', marginTop: 15 },
          loading && { backgroundColor: '#999' },
        ]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Please wait...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#4e8ef7',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
