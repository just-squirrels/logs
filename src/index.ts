import { AsyncLocalStorage } from "node:async_hooks";

const storage = new AsyncLocalStorage();
type Store<Context> = { ctx: Context };

export function withContext<Context>(ctx: Context, fn: () => void) {
    const store: Store<Context> = { ctx };
    storage.run(store, fn);
}

export function update<Context>(reducer: (ctx: Context) => Context) {
    const store = storage.getStore() as Store<Context>;
    if (store) {
        store.ctx = reducer(store.ctx);
    }
}

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

export function log(level: LogLevel, msg: string) {
    const store = storage.getStore() as Store<any>;
    const now = new Date();
    if (store) {
        console.log(`${level} (${now}): ${msg}`, JSON.stringify(store?.ctx));
    }
    else {
        console.log(`${level} (${now}): ${msg}`);
    }
}

export const info = (msg: string) => log("INFO", msg);
export const warn = (msg: string) => log("WARNING", msg);
export const error = (msg: string) => log("ERROR", msg);
export const debug = (msg: string) => log("DEBUG", msg);

export default { withContext, update, log, info, warn, error, debug };