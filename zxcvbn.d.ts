/// <reference types="@types/zxcvbn" />

declare module 'zxcvbn' {
  interface ZXCVBNResult {
    password: string;
  }
}