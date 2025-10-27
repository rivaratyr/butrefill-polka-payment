import productsData from '@/data/products.json';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Cross-platform storage helper
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        // For mobile, use a simple in-memory storage or implement AsyncStorage
        // For now, using a simple global object as fallback
        return (global as any).tempStorage?.[key] || null;
      }
    } catch (error) {
      console.log('Error getting item:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        // For mobile, use simple in-memory storage
        if (!(global as any).tempStorage) {
          (global as any).tempStorage = {};
        }
        (global as any).tempStorage[key] = value;
      }
    } catch (error) {
      console.log('Error setting item:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        if ((global as any).tempStorage) {
          delete (global as any).tempStorage[key];
        }
      }
    } catch (error) {
      console.log('Error removing item:', error);
    }
  }
};

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

export default function ProductScreen() {
    const { id } = useLocalSearchParams();
    const productId = String(id);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    
    // Get product data
    const product: ProductData | null = (productsData as Record<string, ProductData>)[productId] || null;

    // Load saved selection on component mount
    useEffect(() => {
        loadSavedSelection();
        checkResetFlag();
    }, [productId]);

    // Check reset flag when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            checkResetFlag();
        }, [productId])
    );

    const loadSavedSelection = async () => {
        try {
            const saved = await storage.getItem(`product_selection`);
            if (saved && JSON.parse(saved).productId === productId) {
                const { amount } = JSON.parse(saved);
                setSelectedAmount(amount);
            }
        } catch (error) {
            console.log('Error loading saved selection:', error);
        }
    };

    const saveSelection = async (amount: number, productId: string) => {
        try {
            const selection = {
                productId,
                amount,
                timestamp: new Date().toISOString()
            };
            
            await storage.setItem(`product_selection`, JSON.stringify(selection));
        } catch (error) {
            console.log('Error saving selection:', error);
        }
    };

    const checkResetFlag = async () => {
        try {
            const resetFlag = await storage.getItem(`reset_terms_${productId}`);
            if (resetFlag === 'true') {
                console.log('Resetting terms for product:', productId);
                // Reset terms acceptance state
                setTermsAccepted(false);
                // Clear the reset flag
                await storage.removeItem(`reset_terms_${productId}`);
            }
        } catch (error) {
            console.log('Error checking reset flag:', error);
        }
    };

    const onSelectCard = (amount: number) => {
        console.log(`Selected ${amount} for product ${id}`);
        setSelectedAmount(amount);
        saveSelection(amount, productId);
    };

    const handleBackPress = () => {
        router.push('/(tabs)');
    };

    const handleTermsToggle = () => {
        if (!selectedAmount) {
            // Show alert if no amount is selected
            console.log('Please select an amount first');
            return;
        }
        
        const newTermsState = !termsAccepted;
        console.log('Setting terms state to:', newTermsState);
        setTermsAccepted(newTermsState);
        
        // If terms are now accepted and amount is selected, navigate to payment
        if (newTermsState && selectedAmount) {
            // Navigate to payment page with selected data
            router.push({
                pathname: '/payment',
                params: {
                    productId: productId,
                    productName: product?.title || product?.name,
                    amount: selectedAmount,
                    currency: product?.currency || 'USD'
                }
            });
        }
    };

    // Show "No product found" if product doesn't exist
    if (!product) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.notFoundContainer}>
                    <View style={styles.notFoundContent}>
                        <Text style={styles.notFoundIcon}>❌</Text>
                        <Text style={styles.notFoundTitle}>No Product Found</Text>
                        <Text style={styles.notFoundMessage}>
                            The product "{productId}" could not be found in our catalog.
                        </Text>
                        <Pressable style={styles.backToHomeButton} onPress={handleBackPress}>
                            <Text style={styles.backToHomeText}>← Back to Home</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.header}>
            <View style={styles.headerContent}>
                <Pressable style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <View>
                <Text style={styles.title}>{product.name.toUpperCase()}</Text>
                <Text style={styles.subtitle}>GIFT CARD</Text>
                </View>
            </View>
            </View>

            {/* Product Image */}
            <View style={styles.productSection}>
            <View style={[styles.productImage, { backgroundColor: product.backgroundColor }]}>
                <Text style={[styles.productImageText, { color: product.textColor }]}>
                    {product.logo} {product.name.toUpperCase()}
                </Text>
            </View>

            <View style={styles.productInfo}>
                <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productDescription}>
                    {product.description}
                </Text>
                </View>

                <View style={styles.badgeContainer}>
                {product.badges.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                ))}
                </View>
            </View>

            {/* Amount Selection */}
            <View style={styles.amountSection}>
                <Text style={styles.amountSectionTitle}>SELECT AMOUNT ({product.currency})</Text>
                <View style={styles.amountGrid}>
                {product.amounts.map((amount: number) => {
                    const isSelected = selectedAmount === amount;
                    return (
                        <Pressable
                        key={amount}
                        onPress={() => onSelectCard(amount)}
                        style={[
                            styles.amountButton,
                            isSelected && styles.amountButtonSelected
                        ]}
                        >
                        <Text style={[
                            styles.amountValue,
                            isSelected && styles.amountValueSelected
                        ]}>${amount}</Text>
                        <Text style={[
                            styles.amountCurrency,
                            isSelected && styles.amountCurrencySelected
                        ]}>{product.currency}</Text>
                        </Pressable>
                    );
                })}
                </View>
            </View>

            <Pressable 
                style={[
                    styles.termsContainer,
                    !selectedAmount && styles.termsContainerDisabled
                ]} 
                onPress={handleTermsToggle}
                disabled={!selectedAmount}
            >
                <View style={styles.termsContent}>
                <View style={[
                    styles.checkbox,
                    termsAccepted && styles.checkboxChecked,
                    !selectedAmount && styles.checkboxDisabled
                ]}>
                    {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[
                    styles.termsText,
                    !selectedAmount && styles.termsTextDisabled
                ]}>
                    By purchasing, you agree to the terms and conditions. Gift cards are non-refundable.
                </Text>
                </View>
            </Pressable>
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
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f8f8f8',
  },
  backArrow: {
    fontSize: 20,
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  productSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  productImage: {
    width: '100%',
    aspectRatio: 16/9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderRadius: 8,
  },
  productImageText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  productInfo: {
    marginBottom: 32,
  },
  productDetails: {
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  amountSection: {
    marginBottom: 32,
  },
  amountSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    letterSpacing: 2,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountButton: {
    width: '47%',
    height: 80,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  amountCurrency: {
    fontSize: 12,
    color: '#666',
  },
  // Selected amount styles
  amountButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  amountValueSelected: {
    color: '#fff',
  },
  amountCurrencySelected: {
    color: '#ccc',
  },
  termsContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 4,
  },
  termsContainerDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0',
  },
  termsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    marginTop: 2,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkboxDisabled: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    flex: 1,
  },
  termsTextDisabled: {
    color: '#999',
  },
  // Not Found Styles
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  notFoundContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000',
  },
  notFoundMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToHomeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
