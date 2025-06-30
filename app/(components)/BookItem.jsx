import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text } from "react-native";

const BookItem = ({ book }) => {
  const navigation = useNavigation();

  const goToEdit = () => {
    navigation.navigate("EditBook", { bookId: book.id });
  };

  return (
    <Pressable onPress={goToEdit} style={styles.item}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>oleh {book.author}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f0f0f5",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default BookItem;
