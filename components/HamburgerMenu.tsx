import { useAuth } from '@/context/authContext';
import { Pressable, View } from 'react-native';

export const HamburgerMenu = () => {
    const { logout } = useAuth();

    return (
        <Pressable onPress={logout} className='w-10 h-10 bg-burgerBg flex items-center justify-center'>
            <View className='w-full h-full p-3 flex justify-between items-center'>
                <View className='w-full h-0.5 bg-background-300 rounded-sm' />
                <View className='w-full h-0.5 bg-background-300 rounded-sm' />
                <View className='w-full h-0.5 bg-background-300  rounded-sm' />
            </View>
        </Pressable>
    )
}