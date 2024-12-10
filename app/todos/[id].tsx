import {
  useLocalSearchParams, // hook to return the URL parameters for the selected route.
} from 'expo-router';

import { StyleSheet, Text, View, Pressable, TextInput, type ColorSchemeName } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'; // render content within the safe area boundaries of a device.
import { StatusBar } from 'expo-status-bar'; // control the status bar (the top bar of the screen that shows battery, time, etc.)

import { useRouter } from 'expo-router'; // navigation management using a file-based routing system, https://docs.expo.dev/versions/latest/sdk/router/

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter'; // integrate Google Font packages.
import Octicons from '@expo/vector-icons/Octicons';

import { useState, useEffect, useContext } from 'react';

import { ThemeContext } from '@/context/ThemeContext';
import { ColorTokens, ThemeContextType } from '@/types/colors';
import { ITodo } from '@/types/todo';

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<ITodo>({} as ITodo);

  const router = useRouter(); // returns the Router object for imperative navigation.

  const { colorScheme, theme, setColorScheme } = useContext(ThemeContext) as ThemeContextType;

  // fetch todo from storage for editing.
  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp'); // get a string value for given key.
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
        const todoToEdit = storageTodos.find((t: ITodo) => t.id === parseInt(id));
        setTodo(todoToEdit);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    fetchData(id);
  }, [id]);

  const handleSave = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('TodoApp'); // get a string value for given key.
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
      console.log(storageTodos);
      const updatedTodos = storageTodos.map((t: ITodo) => {
        if (t.id === parseInt(id)) {
          return { ...t, title: todo.title };
        }
        return t;
      });
      await AsyncStorage.setItem('TodoApp', JSON.stringify(updatedTodos));
      router.push('/'); // go back to index screen
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // load custom fonts asynchronously.
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  // waiting for the Font to be loaded
  if (!loaded && !error) {
    return null;
  }

  // create styles based on the current theme and color scheme
  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      {/* control status bar visibility */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Edit todo'
          placeholderTextColor='gray'
          value={todo?.title || ''}
          onChangeText={(text) => setTodo((prev) => ({ ...prev, title: text }))}
        />
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
          {colorScheme === 'light' ? (
            <Octicons
              name='sun'
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          ) : (
            <Octicons
              name='moon'
              size={36}
              color={theme.text}
              selectable={undefined}
              style={{ width: 36 }}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable
          style={[styles.saveButton, { backgroundColor: 'red' }]}
          onPress={() => router.push('/')}>
          <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: ColorTokens, colorScheme: ColorSchemeName) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      gap: 6,
      width: '100%',
      maxWidth: 1024, // iPad Pro size
      marginHorizontal: 'auto',
      pointerEvents: 'auto', // control whether the View can be the target of touch events.
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0, // let the input to shrink in small screens.
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
  });
}
