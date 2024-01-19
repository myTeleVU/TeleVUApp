import React from 'react';
// import {CurrentlyOnline} from './CurrentlyOnline/CurrentlyOnline.component';
// import {UpcomingCalls} from './UpcomingCalls/UpcomingCalls.component';
// import {PastCalls} from './PastCalls/PastCalls.component';
// import {FilesAndRecordings} from './FilesAndRecordings/FilesAndRecordings.components';
import {
    StyleSheet,
    Button,
    View,
    SafeAreaView,
    Text,
    Alert,
  } from 'react-native';

const Separator = () => <View style={styles.separator} />;
const Container = () => <View style={styles.container} />;



export default function HomeVU() {
    return (
        <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        example text
      </Text>
      <Button
        title="Press me"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
    </View>
    <Separator />
    
    <View>
      
      <Button
        title="upcoming calls"
        onPress={() => Alert.alert('route to upcoming calls')}
      />
    </View>
    <Separator />
    <View>
      
      <Button
        title="past calls"
        onPress={() => Alert.alert('route to past calls')}
      />
    </View>
    
    
  </SafeAreaView>
    )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 50,
    paddingTop:20,
  },
  title: {
    textAlign: 'center',
    marginVertical: 5,
    lineHeight: 20,
  },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    separator: {
      marginVertical: 80,
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,      
    },
  });
