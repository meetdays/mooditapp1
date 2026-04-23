import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GridIcon,
  HomeIcon,
  ShirtIcon,
  SparklesIcon,
  UserRoundIcon,
} from './TabIcons';

const PRIMARY_COLOR = '#ff6a3d';
const MUTED_COLOR = '#6b7280';

export const TAB_URLS = {
  home: 'https://moodit.ai.kr/home',
  feed: 'https://moodit.ai.kr/feed',
  try: 'https://moodit.ai.kr/try',
  closet: 'https://moodit.ai.kr/closet',
  me: 'https://moodit.ai.kr/me',
} as const;

export type TabKey = keyof typeof TAB_URLS;

type BottomTabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

function TabItem({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon: ReactNode;
}) {
  return (
    <Pressable style={styles.tabButton} onPress={onPress}>
      {icon}
      <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const iconColor = (tab: TabKey) => (activeTab === tab ? PRIMARY_COLOR : MUTED_COLOR);

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 8), height: 90 + Math.max(insets.bottom, 8) }]}>
      <View style={styles.card}>
        <TabItem
          label="홈"
          selected={activeTab === 'home'}
          onPress={() => onTabPress('home')}
          icon={<HomeIcon color={iconColor('home')} />}
        />
        <TabItem
          label="피드"
          selected={activeTab === 'feed'}
          onPress={() => onTabPress('feed')}
          icon={<GridIcon color={iconColor('feed')} />}
        />
        <View style={styles.centerGap} />
        <TabItem
          label="옷장"
          selected={activeTab === 'closet'}
          onPress={() => onTabPress('closet')}
          icon={<ShirtIcon color={iconColor('closet')} />}
        />
        <TabItem
          label="마이"
          selected={activeTab === 'me'}
          onPress={() => onTabPress('me')}
          icon={<UserRoundIcon color={iconColor('me')} />}
        />
      </View>

      <Pressable style={styles.centerButton} onPress={() => onTabPress('try')}>
        <SparklesIcon color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    height: 90,
    justifyContent: 'flex-end',
  },
  card: {
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e8eb',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED_COLOR,
  },
  tabLabelActive: {
    color: PRIMARY_COLOR,
  },
  centerGap: {
    width: 72,
  },
  centerButton: {
    position: 'absolute',
    left: '50%',
    top: 54,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
