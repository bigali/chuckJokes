import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DefaultTheme, Provider as PaperProvider, Searchbar, Appbar, BottomNavigation, Colors} from 'react-native-paper';
import JokeList from "./JokeList";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        accent: 'yellow',
    },
};

const SameRoute = ({ route }) => <JokeList type={route.key} />;



export default class App extends React.Component {
    state = {
        firstQuery: '',
        index: 0,
        routes: [
            {key: 'random', title: 'Random', icon: 'repeat', color: Colors.amber500},
            {key: 'explicit', title: 'Explicit', icon: 'explicit', color: Colors.blue500},
            {key: 'nerdy', title: 'Nerdy', icon: 'games', color: Colors.cyan500},
            {key: 'favorite', title: 'Favorite', icon: 'favorite', color: Colors.deepOrange500},
        ],
        theme: {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: Colors.amber500,
                accent: 'yellow',
            },
        }
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
        random: SameRoute,
        explicit: SameRoute,
        nerdy: SameRoute,
        favorite: SameRoute
    });


    render() {
        const {firstQuery} = this.state;

        return (
            <PaperProvider theme={this.state.theme}>
                <Appbar.Header>
                        <Appbar.Content
                            title="Chuck jokes"
                        />
                </Appbar.Header>



                <BottomNavigation
                    navigationState={this.state}
                    onIndexChange={this._handleIndexChange}
                    renderScene={this._renderScene}
                />

            </PaperProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey200,
    },
});
