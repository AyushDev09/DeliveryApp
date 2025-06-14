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
        navigation.replace('Products'); 
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
        navigation.replace('Products'); p
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4e8ef7',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    backgroundColor: '#4e8ef7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4e8ef7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a0b9f9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  signUpButton: {
    backgroundColor: '#34a853',
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#34a853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  signUpButtonDisabled: {
    backgroundColor: '#8fcb8e',
  },
});

