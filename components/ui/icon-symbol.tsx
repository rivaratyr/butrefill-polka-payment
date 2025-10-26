import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolScale, SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, Platform } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'creditcard.fill': 'account-balance-wallet',
  'clock.fill': 'history',
  'list.bullet': 'list',
  'plus': 'add',
  'person.crop.circle.fill': 'account-circle',
  'magnifyingglass': 'search',
  'gear': 'settings',
  'heart.fill': 'favorite',
  'star.fill': 'star',
  'bookmark.fill': 'bookmark',
  'trash.fill': 'delete',
  'pencil': 'edit',
  'checkmark': 'check',
  'xmark': 'close',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up': 'keyboard-arrow-up',
  'arrow.down': 'keyboard-arrow-down',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: any;
  weight?: SymbolWeight;
  scale?: SymbolScale;
}

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color = '#000',
  style,
  weight = 'regular',
  scale = 'default',
}: IconSymbolProps) {
  if (Platform.OS === 'ios') {
    // On iOS, we can use the SF Symbols
    const SymbolView = require('expo-symbols').SymbolView;
    return (
      <SymbolView
        weight={weight}
        scale={scale}
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={name}
        style={[
          {
            width: size,
            height: size,
          },
          style,
        ]}
      />
    );
  } else {
    // On Android and web, we'll use MaterialIcons as a fallback
    const iconName = MAPPING[name];
    if (!iconName) {
      console.warn(`IconSymbol: No mapping found for "${name}". Add it to the MAPPING object.`);
      // Return a fallback icon
      return (
        <MaterialIcons
          color={color}
          size={size}
          name="help-outline"
          style={[{ width: size, height: size }, style]}
        />
      );
    }

    return (
      <MaterialIcons
        color={color}
        size={size}
        name={iconName}
        style={[{ width: size, height: size }, style]}
      />
    );
  }
}