/**
 * @callback onFulfilled
 * @param {*} value - the wrapped value
 * @returns {*}
 */

/**
 * @callback onRejected
 * @param {*} value - the wrapped value
 * @returns {void}
 */

/**
 * @callback onFinally
 * @param {void}
 * @returns {void}
 */


/**
 * @typedef {Object} Thenable
 * @property {function(onFulfilled, onRejected?): *} then - Handles successful or failed results.
 * @property {function(onRejected): Thenable} catch - Handles only failures.
 * @property {function(onFinally)} finally - Executes a callback regardless of outcome.
 * @property {function: *} unwrap - Unwraps the contained value
 */


/**
 * Checks if a value is not an error
 * @param {any} val
 * @returns {boolean}
 */
const isSuccess = (val) => !(val instanceof Error);


/**
 * Checks if a value is an error
 * @param { * } val
 * @returns {boolean}
 */
const isFailure = (val) => val instanceof Error;


/**
 * A function that wraps any data type into a thenable functor
 * @constructor
 * @param { any } value that value that you want to wrap
 * @returns { Thenable }
 */

const thenable = (value) => {
    let wrappedValue = value;

    const _T = {}

    _T.then = function(fn1, fn2) {
        if (isSuccess(wrappedValue)) {
            wrappedValue = fn1(wrappedValue);
        } else if (fn2 !== undefined) {
            wrappedValue = fn2(wrappedValue);
        }
        return this;
    }

    _T.catch = function(fn) {
        if (isFailure(wrappedValue)) {
            fn(wrappedValue);
        }
        return this;
    }

    _T.finally = function(fn) {
        fn();
        return undefined;
    }

    _T.unwrap = () => wrappedValue;

    return _T;
}


export { thenable };