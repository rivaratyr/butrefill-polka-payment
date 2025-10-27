import Header from '@/components/ui/header';
import productsData from '@/data/products.json';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProductData = {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  backgroundColor: string;
  textColor: string;
  badges: string[];
  amounts: number[];
  currency: string;
  logo: string;
};

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  // Convert products object to array for rendering
  const popularBrands = Object.values(productsData as Record<string, ProductData>);

  const onSearch = (searchQuery: string) => {
    console.log('Searching for:', searchQuery);
    // Navigate to first matching product or just search for the query
    const matchingProduct = popularBrands.find(brand => 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingProduct) {
      router.push(`/product/${matchingProduct.id}`);
    }
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <View style={styles.mainContainer}>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchTitle}>SEARCH GIFT CARDS</Text>
            <Text style={styles.searchSubtitle}>Find and purchase with DOT</Text>
          </View>

          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="SEARCH BRANDS..."
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              placeholderTextColor="#666"
            />
          </View>

          <Pressable
            onPress={() => onSearch(query || "Netflix")}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>SEARCH</Text>
          </Pressable>

          {/* Popular Brands */}
          <View style={styles.popularBrands}>
            <Text style={styles.popularBrandsTitle}>POPULAR BRANDS</Text>
            <View style={styles.brandsContainer}>
              {popularBrands.map((brand) => (
                <Pressable
                  key={brand.id}
                  onPress={() => navigateToProduct(brand.id)}
                  style={styles.brandButton}
                >
                  <View style={styles.brandInfo}>
                    <Text style={styles.brandName}>{brand.logo} {brand.name.toUpperCase()}</Text>
                    <Text style={styles.brandCategory}>{brand.category}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },

  searchSection: {
    flex: 1,
    paddingVertical: 32,
  },
  searchHeader: {
    marginBottom: 32,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchInputContainer: {
    position: 'relative',
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  popularBrands: {
    marginTop: 48,
  },
  popularBrandsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    letterSpacing: 2,
  },
  brandsContainer: {
    gap: 8,
  },
  brandButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 4,
  },
  brandInfo: {
    alignItems: 'flex-start',
  },
  brandName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  brandCategory: {
    fontSize: 12,
    color: '#666',
  },
  chevron: {
    fontSize: 20,
    color: '#666',
  },
});
