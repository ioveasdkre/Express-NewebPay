/**
 * Express router paths go here.
 */

import { Immutable } from '@src/types/custom.type';

const Paths = {
  Base: '/api',
  Homes: {
    Base: '/home',
    Index: '',
    CreateOrder: '/createOrder',
    Order: '/order/:id',
    Notify: '/spgateway_notify',
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
