class EventBus {
    #listeners;
    constructor() {
        this.#listeners = new Map();
    }

    /**
     * Register a listener for an event.
     * @param {string} event - The event to listen for.
     * @param {Function} listener - The listener function to be called when the event is emitted.
     */
    on(event, listener) {
        if (typeof listener !== 'function') {
            throw new Error('Listener must be a function');
        }

        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }

        this.#listeners.get(event).push(listener);
    }

    /**
     * Emit an event to all registered #listeners.
     * @param {string} event - The event to emit.
     * @param  {...any} args - Arguments to pass to #listeners.
     */
    async emit(event, ...args) {
        if (!this.#listeners.has(event)) {
            console.warn(`No #listeners for event: ${event}`);
            return;
        }

        const listeners = this.#listeners.get(event);
        const promises = listeners.map(listener => {
            try {
                return Promise.resolve(listener(...args));
            } catch (error) {
                console.error(`Error occurred in listener for event ${event}:`, error);
                return Promise.reject(error);
            }
        });

        try {
            await Promise.all(promises);
        } catch (error) {
            console.error(`Error while processing event ${event}:`, error);
        }
    }

    /**
     * Remove a listener for an event.
     * @param {string} event - The event to remove the listener from.
     * @param {Function} listener - The listener function to remove.
     */
    off(event, listener) {
        if (!this.#listeners.has(event)) return;

        const listeners = this.#listeners.get(event);
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Remove all #listeners for a specific event.
     * @param {string} event - The event to remove all #listeners for.
     */
    removeAllListeners(event) {
        if (this.#listeners.has(event)) {
            this.#listeners.delete(event);
        }
    }

    /**
     * Remove all #listeners for all events.
     */
    removeAll() {
        this.#listeners.clear();
    }
}

export default EventBus;
