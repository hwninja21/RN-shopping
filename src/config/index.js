export * from './Constants'
import * as Sentry from '@sentry/react-native';

export const configureSentryUser = user => {
  Sentry.configureScope(scope => {
    scope.setUser({
      email: user.email,
      id: user.id.toString(), // Has to be a string, otherwise will throw an error
    });
  });
};
