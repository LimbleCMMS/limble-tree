export interface ContentContainer<T> {
   getContents: () => T;
   setContents: (contents: T) => void;
}
