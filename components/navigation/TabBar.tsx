import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC, Fragment, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/store';
import TrainingBanner from '../Screens/addTraining/TrainingBanner';

const TabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const router = useRouter();
  const trainingInProgress = useAppSelector(state => state.training.inProgress);

  return (
    <Fragment>
      {trainingInProgress && <TrainingBanner />}
      <View style={{ flexDirection: 'row' }} className='flex flex-row px-5'>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          if (['_sitemap', '+not-found'].includes(route.name)) return null;

          const labelToString = label as string;

          const Icon = options.tabBarIcon as ReactNode;

          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === '(addTraining)') {
              router.push('/(app)/addTraining');
            } else {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View key={route.key} className='grow flex flex-row items-center justify-center'>
              <TouchableOpacity
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                className={`bg-scarlet-300 rounded-full h-12 w-12 flex items-center justify-center bottom-6 ${index === 2 && 'w-16 h-16'}`}
              >
                <Icon />
              </TouchableOpacity>
            </View>
          );

        })}
      </View>
    </Fragment>
  );
}

export default TabBar;