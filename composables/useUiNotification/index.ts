import VueCompositionAPI, { computed, reactive } from '@vue/composition-api';
import Vue from 'vue';

// We need to register it again because of Vue instance instantiation issues
Vue.use(VueCompositionAPI);
interface UiNotification {
  type: 'danger' | 'success' | 'info';
  icon?: string;
  persist?: boolean;
  id?: symbol;
  dismiss?: () => void;
}

interface Notifications {
  notifications: Array<UiNotification>;
}

const state = reactive<Notifications>({
  notifications: []
});
const maxVisibleNotifications = 3;
const timeToLive = 3000;

const useUiNotification = () : any => {
  const send = (notification: UiNotification) => {
    const id = Symbol('id');

    const dismiss = () => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === id
      );

      if (index !== -1) state.notifications.splice(index, 1);
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    state.notifications.push(newNotification);

    if (state.notifications.length > maxVisibleNotifications)
      state.notifications.shift();

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }
  };

  return {
    send,
    notifications: computed(() => state.notifications)
  };
};

export default useUiNotification;
