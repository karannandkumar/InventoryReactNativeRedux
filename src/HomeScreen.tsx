import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Button
} from "react-native";
import { Appbar, DataTable, FAB } from "react-native-paper";
import {
  NavigationEvents,
  SafeAreaView,
  NavigationInjectedProps
} from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";

export default (props: NavigationInjectedProps) => {
  const fetching = useSelector((state: RootState) => state.inventory.fetching);
  let inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();

  const newoff = useSelector((state: RootState) => state.inventory.offset);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize
  }) => {
    const paddingToBottom = 10;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const [input, setInput] = useState("");
  const [search, setSearch] = useState(inventory);

  const setfilter = e => {
    setInput(e);
    inventory = inventory.filter(data =>
      data.fields["Product Code"].includes(input)
    );
    setSearch(inventory);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => dispatch(actions.fetchInventory())}
      />
      <Appbar.Header>
        <Appbar.Content title="Inventory" />
      </Appbar.Header>

      <ScrollView
       
        style={{ flex: 1 }}
        ref={ref => (this.ScrollView = ref)}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            
            if (typeof newoff !== "undefined") {
              dispatch(actions.fetchMoreInventory());
              this.ScrollView.scrollTo({ y: 0 });
            }
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps="always"
     
      >
        <SafeAreaView>
          <View style={{ flex: 2, left: 15, paddingRight:25,top: 10 ,flexDirection: 'row',justifyContent:'space-between'}}>
            <TextInput 
              style ={{flex:1}}
              placeholder="Filter Inventory"
              onChangeText={text => setfilter(text)
              }
              value={input}
            />
        
            <Button 
             title='Reset' onPress ={()=>setInput('')} color = '#7905ff'></Button>
         
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product Code</DataTable.Title>
              <DataTable.Title numeric>Scan Date</DataTable.Title>
            </DataTable.Header>
            {(input != "" ? search : inventory).map((record, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{record.fields["Product Code"]}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {new Date(record.fields.Posted).toLocaleDateString()}{" "}
                  {new Date(record.fields.Posted).toLocaleTimeString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </SafeAreaView>
      </ScrollView>

      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
            <MaterialCommunityIcons name="barcode" size={24} color="#0B5549" />
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
    alignItems: "center"
  }
});
