import * as React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen({ navigation }) {
    return (
        <View >
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Settings Screen, route to that component</Text>
        </View>
    );
}
