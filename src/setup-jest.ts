import 'jest-extended';
import 'jest-preset-angular/setup-jest';

Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: [ '-webkit-appearance' ],
    };
  },
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

jest.mock('firebase/firestore', () => ({
  ...(jest.requireActual('firebase/firestore')),
  collection: jest.fn(),
  CollectionReference: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn().mockReturnValue({
    withConverter: jest.fn()
  }),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
  query: jest.fn().mockReturnValue({
    withConverter: jest.fn()
  }),
  QueryConstraint: jest.fn(),
  setDoc: jest.fn(),
  where: jest.fn(),
}))
