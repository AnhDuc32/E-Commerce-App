import StackNavigator from 'navigation/StackNavigator';
import './global.css';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from 'store';
import { ModalPortal } from "react-native-modals";
import { UserContext } from 'UserContext';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  const pkg = STRIPE_PUBLISHABLE_KEY;

  return (
    <>
      <Provider store={store}>
        <UserContext>
          <StripeProvider publishableKey={pkg}>
            <StackNavigator />
            <ModalPortal />
          </StripeProvider>
        </UserContext>
      </Provider>
    </>
  );
}
