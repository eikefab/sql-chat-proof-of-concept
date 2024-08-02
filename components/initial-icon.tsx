import { StyleSheet, Text, View } from "react-native";

export type InitialIconProps = {
    text: string;
}

export default function InitialIcon({ text }: InitialIconProps) {

    function getInitials() {
        const names = text.split(" ");

        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }

    return (
        <View style={styles.icon}>
            <Text style={styles.iconText}>{getInitials()}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    icon: {
        borderRadius: 99,
        backgroundColor: "#999999",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: 60,
        height: 60,
    },
    iconText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});