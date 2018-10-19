import React from 'react';
import {AsyncStorage, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
    DefaultTheme,
    Provider as PaperProvider,
    Searchbar,
    Appbar,
    BottomNavigation,
    Colors,
    Portal, Dialog, TouchableRipple, RadioButton, Subheading,Button
} from 'react-native-paper';
import FactScene from './FactScene'
import FavouriteFactScene from './FavouriteFactScene'
import ImagesFactScene from "./ImagesFactScene";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'blue',
        accent: 'blue',
    },
};

const tri = [
    {
        key: 'last',
        label: 'Derniers ajouts'
    },
    {
        key: 'first',
        label: 'Les Débuts'
    },
    {
      key: 'top',
        label: 'Les top'
    },
    {
        key: 'flop',
        label: 'Les flops'
    }, {
        key: 'alea',
        label: 'Aléatoire'
    }

]



export default class App extends React.Component {
    state = {
        firstQuery: '',
        index: 0,
        favoriteJokes: [],
        routes: [
            {key: 'facts', title: 'Facts', icon: 'home', color: Colors.blueGrey500, tri: 'last'},
            {key: 'images', title: 'En images', icon: 'image', color: Colors.blue500, tri: 'last'},
            {key: 'favorite', title: 'Favoris', icon: 'favorite', color: Colors.green600, tri: 'top'},
        ],
        theme: {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: Colors.blueGrey500,
                accent: Colors.grey200,
            },
        },
        visible: false,
        checked: 'last',
        sort: 'last'
    };
    async retrieveItem(key) {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {

        }
        return
    }

    updateFavoriteJokes = (jokes) => {
        this.setState({
            favoriteJokes: jokes
        })
    }

    FactsRoute = ({ route }) => <FactScene tri={route.tri} updateFavoriteJokes={this.updateFavoriteJokes} favoriteJokes={this.state.favoriteJokes}/>
    ImagesRoute = ({ route }) => <ImagesFactScene tri={route.tri} updateFavoriteJokes={this.updateFavoriteJokes} favoriteJokes={this.state.favoriteJokes}/>
    FavouriteRoute = ({ route }) => <FavouriteFactScene tri={route.tri} favoriteJokes={this.state.favoriteJokes} updateFavoriteJokes={this.updateFavoriteJokes} />
    _handleIndexChange = index => {
        this.setState({index});
        const color = this.state.routes[index].color
        this.setState({
            index: index,
            checked: '',
            theme: {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: color,
                    accent: Colors.grey200,
                },
            }
        })
    }
    componentDidMount() {
        this.retrieveItem("jokes").then((jokes) => {
            this.setState({
                favoriteJokes: jokes
            })
        }).catch((error) => {
        })
    }

    _renderScene = BottomNavigation.SceneMap({
        facts: this.FactsRoute,
        images: this.ImagesRoute,
        favorite: this.FavouriteRoute,
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
        const { checked, visible } = this.state;
        return (
            <PaperProvider theme={this.state.theme}>
                <Appbar.Header>
                        <Appbar.Content
                            title="Chuck jokes"
                        />
                    { this.state.index !== 2 ?
                        <Appbar.Action icon="filter-list" onPress={this._filterJokes} />:
                        null
                    }

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
                                    {
                                        tri.map((option) => {
                                            return(
                                                <TouchableRipple
                                                    key={option.key}
                                                    onPress={() => this.setState({ checked: option.key })}
                                                >
                                                    <View style={styles.row}>
                                                        <View pointerEvents="none">
                                                            <RadioButton
                                                                value={option.key}
                                                                status={checked === option.key ? 'checked' : 'unchecked'}
                                                            />
                                                        </View>
                                                        <Subheading style={styles.text}>{option.label}</Subheading>
                                                    </View>
                                                </TouchableRipple>
                                            )
                                        })
                                    }

                                </View>
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button onPress={() => {
                                const routes = this.state.routes
                                routes[this.state.index].tri =  this.state.checked
                                this.setState({
                                    routes: routes,
                                    visible: false
                                })
                            }}>Valider</Button>
                            <Button onPress={() => {
                                this.setState({
                                    visible: false
                                })
                            }}>Annuler</Button>
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
