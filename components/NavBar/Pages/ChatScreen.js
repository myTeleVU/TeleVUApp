import * as React from 'react';
import { View, Text } from 'react-native';
//import { ChatBar } from '../../Session/ChatBar/ChatBar.component'
import { Messagecomponent } from '../../Session/Message.component'

export default function ChatScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Chat Screen, route to chatvu</Text>
                <Messagecomponent item={{ currentUser: 'Adam', test: 'Hello', time: '6:15' }} currentUser={'Adam'} />
                
        </View>
    );
}
