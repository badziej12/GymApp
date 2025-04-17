import { View } from "react-native"
import { StatsCard } from "./StatsCard"

export const UserStats = () => {

    return (
        <View className="flex flex-row flex-wrap" style={{marginLeft: -8, marginRight: -8}}>
            <StatsCard />
            <StatsCard />
            <StatsCard />
            <StatsCard />
        </View>
    )
}