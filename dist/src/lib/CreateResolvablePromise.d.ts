import IResolvablePromise from '../interfaces/IResolvablePromise';
export default function CreateResolvablePromise<T = any>(timeoutMillis?: number, timeoutMessage?: string): IResolvablePromise<T>;
