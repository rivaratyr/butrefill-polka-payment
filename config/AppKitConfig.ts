import "@walletconnect/react-native-compat";

import { EthersAdapter } from '@reown/appkit-ethers-react-native';
import { createAppKit } from '@reown/appkit-react-native';
import { AppKitStorage } from './AppKitStorage';

// You can use 'viem/chains' or define your own chains using `AppKitNetwork` type. Check Options/networks for more detailed info
import { mainnet, polygon } from 'viem/chains';

const projectId = process.env.EXPO_PUBLIC_REOWN_PROJECT_ID; // Obtain from https://dashboard.reown.com/

if (!projectId) {
  throw new Error('EXPO_PUBLIC_REOWN_PROJECT_ID environment variable is not set. Please obtain a project ID from https://dashboard.reown.com/');
}

const ethersAdapter = new EthersAdapter();

export const appKit = createAppKit({
  projectId,
  networks: [mainnet, polygon],
  defaultNetwork: mainnet, // Optional: set a default network
  adapters: [ethersAdapter],
  storage: new AppKitStorage(),
  // Only NovaWallet will be available in the wallet picker
  includeWalletIds: ['43fd1a0aeb90df53ade012cca36692a46d265f0b99b7561e645af42d752edb92'],
  featuredWalletIds: ['43fd1a0aeb90df53ade012cca36692a46d265f0b99b7561e645af42d752edb92'],
  features: {
    swaps: false,
    socials: false,
    onramp: false
  },

  // Other AppKit options (e.g., metadata for your dApp)
  metadata: {
    name: 'Dotrefill',
    description: 'Polkadot Bitrefill Payment - Pay with your DOT',
    url: 'https://novanet.hu',
    icons: ['https://novanet.hu/novanet-polkadot-bitrefill-payment-icon.png'],
    redirect: {
      native: "novanet-polkadot-bitrefill-payment://",
      universal: "polka-bitrefill-payment.novanet.hu",
    },
  }
});