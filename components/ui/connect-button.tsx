import { useAccount, useAppKit } from '@reown/appkit-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function ConnectButton() {
  const { open, disconnect } = useAppKit();
  const { address, isConnected, chainId } = useAccount();

  if (isConnected) {
    return (
      <View style={styles.connectedContainer}>
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionLabel}>WALLET CONNECTED</Text>
          <Text style={styles.chainText}>Chain: {chainId}</Text>
          <Text style={styles.addressText}>
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No address'}
          </Text>
        </View>
        <Pressable
          onPress={() => disconnect()}
          style={styles.disconnectButton}
        >
          <Text style={styles.disconnectButtonText}>DISCONNECT</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => open()}
      style={styles.connectButton}
    >
      <Text style={styles.connectButtonText}>🔗 CONNECT WALLET</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  connectButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  connectedContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 4,
    marginVertical: 8,
  },
  connectionInfo: {
    marginBottom: 16,
  },
  connectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 8,
  },
  chainText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  disconnectButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  disconnectButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ConnectButton;