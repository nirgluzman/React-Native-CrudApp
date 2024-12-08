import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  type ColorSchemeName,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated, { LinearTransition } from 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';

// https://icons.expo.fyi/Index/MaterialCommunityIcons/delete-circle
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';

import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';

import { useState, useEffect, useContext } from 'react';

import { ThemeContext } from '@/context/ThemeContext';
import { ColorTokens, ThemeContextType } from '@/types/colors';

// // example data
// import { data } from '@/data/todos';
import { ITodo } from '@/types/todo';

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const { colorScheme, theme, setColorScheme } = useContext(ThemeContext) as ThemeContextType;

  // load initial data from storage on first app launch.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp'); // get a string value for given key.
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
        setTodos(storageTodos.sort((a: ITodo, b: ITodo) => b.id - a.id)); // sorting the data array in descending order based on the id property (to have the newest todo in the beginning)
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    fetchData();
  }, []);

  // save todo state to storage on state change.
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem('TodoApp', jsonValue); // sets a string value for given key.
      } catch (error) {
        console.error('Error saving todos:', error);
      }
    };

    storeData();
  }, [todos]);

  // load custom fonts asynchronously.
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  // waiting for the Font to be loaded
  if (!loaded && !error) {
    return null;
  }

  // add a new todo
  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText(''); // clear the input field after adding a todo.
    }
  };

  // toggle the completed status
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  // delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // create styles based on the current theme and color scheme
  const styles = createStyles(theme, colorScheme);

  interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
  }

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItems}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}>
        {item.title}
      </Text>
      <Pressable onPress={() => deleteTodo(item.id)}>
        <MaterialCommunityIcons name='delete-circle' size={36} color='red' selectable={undefined} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='add a new todo'
          placeholderTextColor='gray'
          autoComplete={'off'} // disable auto-complete suggestions
          autoCorrect={false} // disable auto-correct suggestions
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
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

      <Animated.FlatList
        data={todos} // an array (or array-like list) of items to render.
        renderItem={renderItem} // takes an item from data and renders it into the list.
        keyExtractor={(item) => item.id.toString()} // used to extract a unique key for a given item at the specified index.
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag' // the keyboard will dismiss when the user drags down on the keyboard.
      />
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
      marginBottom: 10,
      padding: 10,
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
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItems: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024, // iPad Pro size
      marginHorizontal: 'auto',
      pointerEvents: 'auto', // control whether the View can be the target of touch events.
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  });
}
