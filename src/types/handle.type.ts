import * as e from 'express';

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes<T = void> extends e.Response {
  locals: {
    sessionUser?: T;
  };
}
