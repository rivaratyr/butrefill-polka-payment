import Header from '@/components/ui/header';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function History() {
  return (
    <ScrollView style={styles.container}>
      <Header />

      <View style={styles.mainContainer}>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
});
