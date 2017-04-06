import RX = require('reactxp');

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }),
  welcome: RX.Styles.createTextStyle({
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }),
  instructions: RX.Styles.createTextStyle({
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }),
};

interface IAppProps {
}

interface IAppState {
}

class App extends RX.Component<IAppProps, IAppState> {
  render(): JSX.Element | null {
    return (
      <RX.View style={styles.container}>
        <RX.Text style={styles.welcome}>
          Welcome to ReactXP!
        </RX.Text>
        <RX.Text style={styles.instructions}>
          To get started, edit App.tsx.
        </RX.Text>
      </RX.View>
    );
  }
}

export = App;
