// // Define allowed task statuses as a union type
// type TaskStatus = keyof typeof allowedTransitions;
const allowedTransitions = {
  initialize: ['active', 'delete'],
  active: ['complete', 'overdue'],
  complete: ['delete'],
  overdue: ['active', 'complete', 'cancel'],
  cancel: ['delete'],
  delete: [],
};

export function isValidStatus(currentStatus: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const index: number | undefined =
    Object.keys(allowedTransitions).indexOf(currentStatus);
  const values = Object.values(allowedTransitions)[index];
  return values;
}
