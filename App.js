import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
    DefaultTheme,
    Provider as PaperProvider,
    Searchbar,
    Appbar,
    BottomNavigation,
    Colors,
    Portal, Dialog, TouchableRipple, RadioButton, Subheading,Button
} from 'react-native-paper';
import JokeList from "./JokeList";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'blue',
        accent: 'blue',
    },
};

const JokeListRoute = ({ route }) => <JokeList type={route.key} />;
const FavouriteListRoute = ({ route }) => <JokeList />;
const tri = [
    {
        key: 'last',
        label: 'Derniers ajouts'
    },
    {
        key: 'first',
        label: 'Les Débuts'
    }

]
/*
        first	Les facts classées par date, les ancienne en premieres
        top	Les facts classées par point, les mieux notés en premieres
        flop	Les facts classées par point, les moins bien notés en premieres
        mtop	Les facts classées par moyenne, les mieux notés en premieres
        alea	Des facts aléatoire
        mflop
 */


export default class App extends React.Component {
    state = {
        firstQuery: '',
        index: 0,
        routes: [
            {key: 'facts', title: 'Facts', icon: 'home', color: Colors.amber500},
            {key: 'images', title: 'En images', icon: 'image', color: Colors.blue500},
            {key: 'favorite', title: 'Favoris', icon: 'favorite', color: Colors.deepOrange500},
        ],
        theme: {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: Colors.amber500,
                accent: 'yellow',
            },
        },
        visible: false
    };

    _handleIndexChange = index => {
        this.setState({index});
        const color = this.state.routes[index].color
        this.setState({
            theme: {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: color,
                    accent: 'yellow',
                },
            }
        })
    }

    _renderScene = BottomNavigation.SceneMap({
        facts: JokeListRoute,
        images: JokeListRoute,
        favorite: JokeListRoute,
    });
    _filterJokes = (filter) => {
        this.setState({
            visible: true
        })
    }

    _close = () => {
        this.setState({
            visible: false
        })
    }


    render() {
        const {firstQuery, checked, visible} = this.state;
        return (
            <PaperProvider theme={this.state.theme}>
                <Appbar.Header>
                        <Appbar.Content
                            title="Chuck jokes"
                        />
                    <Appbar.Action icon="filter-list" onPress={this._filterJokes} />

                </Appbar.Header>



                <BottomNavigation
                    navigationState={this.state}
                    onIndexChange={this._handleIndexChange}
                    renderScene={this._renderScene}
                />
                <Portal>
                    <Dialog onDismiss={this._close} visible={visible}>
                        <Dialog.Title>Choose an option</Dialog.Title>
                        <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
                            <ScrollView>
                                <View>
                                    <TouchableRipple
                                        onPress={() => this.setState({ checked: 'normal' })}
                                    >
                                        <View style={styles.row}>
                                            <View pointerEvents="none">
                                                <RadioButton
                                                    value="normal"
                                                    status={checked === 'normal' ? 'checked' : 'unchecked'}
                                                />
                                            </View>
                                            <Subheading style={styles.text}>Option 1</Subheading>
                                        </View>
                                    </TouchableRipple>
                                </View>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button onPress={() => {}}>Valider</Button>
                            <Button onPress={() => {}}>Annuler</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </PaperProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey200,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        paddingLeft: 8,
    },
});
