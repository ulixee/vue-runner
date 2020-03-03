import IResolvablePromise from '../interfaces/IResolvablePromise';

export default function CreateResolvablePromise<T = any>(
    timeoutMillis?: number,
    timeoutMessage?: string,
): IResolvablePromise<T> {
  const response: any = {
    isResolved: false,
  };
  const error = new Error(timeoutMessage || 'Timeout waiting for promise');

  response.promise = new Promise((resolve, reject) => {
    response.resolve = (...args: any[]) => {
      if (response.isResolved) return;
      response.isResolved = true;
      if (response.timeout) clearTimeout(response.timeout);
      resolve(...args);
    };
    response.reject = (err: any) => {
      if (response.isResolved) return;
      response.isResolved = true;
      if (response.timeout) clearTimeout(response.timeout);
      reject(err);
    };
    if (timeoutMillis) {
      response.timeout = setTimeout(() => response.reject(error), timeoutMillis);
    }
  });


  return response as IResolvablePromise<T>;
}
