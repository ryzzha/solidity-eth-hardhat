// types/global.d.ts
export {};

declare global {
  interface Window {
    ethereum: any; // Спрощений варіант. Можна вказати більш точний тип
  }
}
