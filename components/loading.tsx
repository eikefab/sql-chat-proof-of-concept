import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loading() {
    return (
        <SafeAreaView style={{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center", 
        }}>
            <ActivityIndicator 
                size={36}
                color="#255CE4"
            />
        </SafeAreaView>
    )
}