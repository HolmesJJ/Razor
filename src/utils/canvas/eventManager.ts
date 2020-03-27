import { isString } from "./utils";

function isEventLegal(event) {
  if (!isString(event) || !event) {
    console.warn("[Razor Warn]  event name is illegal");
    return false;
  }
  return true;
}

export default class EventManager {
  subs: any = {};
  /* eslint-disable-next-line */
  emit(event: string, data) {
    if (!isEventLegal(event)) {
      return;
    }
    // 没有订阅
    if (
      !this.subs[event] ||
      !Array.isArray(this.subs[event]) ||
      !this.subs[event].length
    ) {
      console.warn("[Razor Warn] The event subscribe doesn't existed");
      return;
    }
    const args = Array.from(arguments).slice(1);
    this.run(event, args);
  }

  run(event, args) {
    this.subs[event] = this.subs[event] || [];
    this.subs[event].forEach(callback => {
      callback(...args);
    });
  }

  on(event: string, callback) {
    if (!isEventLegal(event)) {
      return;
    }

    if (!callback) {
      console.error(`[Razor Warn]  ${event} callback is required`);
      return;
    }
    this.subs[event] = this.subs[event] || [];
    this.subs[event].push(callback);
  }

  remove(event: string, callback) {
    if (!isEventLegal(event)) {
      return;
    }
    this.subs[event] = this.subs[event] || [];
    this.subs[event] = this.subs[event].filter(cb => {
      return cb !== callback;
    });
  }

  removeEvent(event) {
    if (!isEventLegal(event)) {
      return;
    }
    this.subs[event] = [];
    delete this.subs[event];
  }

  teardown() {
    Object.keys(this.subs).forEach(event => {
      this.removeEvent(event);
    });
  }
}
