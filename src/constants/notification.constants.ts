export const NOTIFICATION_ROLES = {
  CHEF: 'chef',
  WAITER: 'waiter',
  MANAGER: 'manager',
} as const;

export const NOTIFICATION_EVENTS = {
  // Events từ client
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',

  // Events từ server
  NEW_ORDER: 'newOrder',
  FOOD_READY: 'foodReady',
  PAYMENT_RECEIVED: 'paymentReceived',
  SYSTEM_ERROR: 'systemError',
} as const;

export const NOTIFICATION_ROOMS = {
  CHEF_ROOM: 'chef',
  WAITER_ROOM: 'waiter',
  MANAGER_ROOM: 'manager',
} as const;

export const NOTIFICATION_MESSAGES = {
  NEW_ORDER: 'Có đơn hàng mới cần chế biến',
  FOOD_READY: 'Món ăn đã sẵn sàng để phục vụ',
  PAYMENT_RECEIVED: 'Có hóa đơn thanh toán mới',
} as const; 