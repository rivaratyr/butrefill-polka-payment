import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


// Cross-platform storage helper
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        // For mobile, use simple in-memory storage
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

interface PaymentScreenProps {
  amount: number;
  dotAmount: number;
  productName?: string;
  onPay?: () => void;
  onBack?: () => void;
}

export default function PaymentScreen({
  amount: propAmount,
  dotAmount: propDotAmount,
  productName: propProductName,
  onPay,
  onBack
}: PaymentScreenProps) {
  
  // Get route parameters
  const params = useLocalSearchParams();
  const productId = params.productId as string;
  const amount = Number(params.amount) || propAmount;
  const productName = (params.productName as string) || propProductName;
  const currency = (params.currency as string)
  const dotAmount = propDotAmount || (amount / 5.5); // Calculate DOT amount based on exchange rate

  const resetTermsAcceptance = async (productId: string) => {
    try {
      // Set a flag to reset terms when returning to product page
      await storage.setItem(`reset_terms_${productId}`, 'true');
    } catch (error) {
      console.log('Error setting reset flag:', error);
    }
  };

  const handleBack = async () => {
    // Reset the terms acceptance state for this product
    if (productId) {
      await resetTermsAcceptance(productId);
    }
    
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handlePay = () => {
    if (onPay) {
      onPay();
    } else {
      console.log('Processing payment...');
      // Handle payment logic here
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View>
              <Text style={styles.title}>PAYMENT</Text>
              <Text style={styles.subtitle}>CONFIRM DETAILS</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentDetails}>
            {/* Product Card */}
            <View style={styles.productCard}>
              <Text style={styles.productLabel}>PRODUCT</Text>
              <Text style={styles.productTitle}>{productName}</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountValue}>${amount}</Text>
                <Text style={styles.amountCurrency}>USD</Text>
              </View>
            </View>

            {/* Conversion Separator */}
            <View style={styles.conversionSeparator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>CONVERTS TO</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* DOT Payment Card */}
            <View style={styles.dotPaymentCard}>
              <Text style={styles.dotPaymentLabel}>PAYMENT AMOUNT</Text>
              <View style={styles.dotAmountContainer}>
                <Text style={styles.dotAmountValue}>{(dotAmount + 0.01).toFixed(2)}</Text>
                <Text style={styles.dotAmountCurrency}>DOT</Text>
              </View>
              <Text style={styles.dotTokenLabel}>POLKADOT TOKEN</Text>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={styles.transactionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Exchange Rate</Text>
              <Text style={styles.detailValue}>1 DOT = $5.50</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network Fee</Text>
              <Text style={styles.detailValue}>~0.01 DOT</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{(dotAmount + 0.01).toFixed(2)} DOT</Text>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              You will be redirected to Nova Wallet to complete the payment. The transaction will be confirmed on the Polkadot network.
            </Text>
          </View>

          {/* Payment Button */}
          <Pressable style={styles.paymentButton} onPress={handlePay}>
            <Text style={styles.paymentButtonText}>PAY WITH NOVA WALLET</Text>
          </Pressable>
        </View>
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
  paymentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  paymentDetails: {
    marginBottom: 32,
  },
  productCard: {
    padding: 24,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 16,
  },
  productLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  amountCurrency: {
    fontSize: 14,
    color: '#666',
  },
  conversionSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  separatorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dotPaymentCard: {
    padding: 24,
    backgroundColor: '#e6007a',
    borderWidth: 2,
    borderColor: '#e6007a',
    borderRadius: 8,
  },
  dotPaymentLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dotAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  dotAmountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dotAmountCurrency: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dotTokenLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  transactionDetails: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  infoBox: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    flex: 1,
  },
  paymentButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#e6007a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
