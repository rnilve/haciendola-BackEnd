declare namespace Express {
  export interface Request {
    execQuery: ExecQuery;
    end: () => void;
    user?: unknown;
    body?: object;
  }

  type ResponseData = {
    code?: string;
    message?: string;
    data?: unknown;
  };

  export interface Response {
    resp: (json?: ResponseData) => void;
  }
}
