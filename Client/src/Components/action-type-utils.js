/**
 * Appends REQUEST async action type
 */

export const REQUEST = actionType => `${actionType}/pending`;

/**
 * Appends SUCCESS async action type
 */

export const SUCCESS = actionType => `${actionType}/fulfilled`;

/**
 * Appends FAILURE async action type
 */

export const FAILURE = actionType => `${actionType}/rejected`;