/**
 * Express router paths go here.
 */

import { Immutable } from '@src/types/custom.type';

const Paths = {
  Homes: {
    Base: '/home',
    Index: '',
    Check: '/check',
    Notify: '/spgateway_notify',
    Return: '/spgateway_return',
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
