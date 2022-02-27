import { TestBed } from '@angular/core/testing';
import { DataObjectInterface } from '../interfaces';

import { FirestoreService } from './firestore.service';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';
import { deleteDoc, getDoc, getDocs, QueryConstraint, setDoc } from 'firebase/firestore';
import { DatabaseError, DocumentNotFound, EmptyDocument, QuotaExceededError } from '../errors';
import { slugify } from '../tools';
import { dateMock } from '../mocks/date.mock';
import { dummyConverter } from '../mocks/firestore.mock';

class DummyService extends FirestoreService<DataObjectInterface> {
  constructor(private logger: LoggerService) {
    super(logger, 'test', dummyConverter);
  }
}

describe('FirestoreService', () => {
  let service: FirestoreService<DataObjectInterface>;
  let loggerServiceMock: LoggerService;

  let loggerSpy: jest.SpyInstance;

  const unknownErrorMessage = 'Unknown error';
  const unknownError = new Error(unknownErrorMessage);

  const dataObjectId = '1';
  const dataObject = { name: '1', slug: '1' } as DataObjectInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(LoggerService)
      ]
    });
    loggerServiceMock = TestBed.inject(LoggerService);
    service = new DummyService(loggerServiceMock);
    loggerSpy = jest.spyOn(service['loggerService'], 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('lastUpdated', () => {
    it('should update lastUpdated date', () => {
      jest.spyOn(service, 'getLastUpdated$').mockReturnValue(of(dateMock));

      service!.initLastUpdated();

      expect(service['lastUpdated']).toEqual(dateMock);
    });
  })

  describe('storeIsOutdated', () => {
    it('should return true if last updated is undefined', () => {
      service['lastUpdated'] = undefined;
      expect(service.storeIsOutdated()).toBe(true);
    });
    it('should return true if last updated is old', () => {
      service['lastUpdated'] = dateMock;
      expect(service.storeIsOutdated()).toBe(true);
    });
    it('should return false if last updated is not old', () => {
      service['lastUpdated'] = new Date();
      expect(service.storeIsOutdated()).toBe(false);
    });
  });

  describe('queryList', () => {
    it('should be list objects', async () => {
      let dataObjects;

      service['refreshed'] = false;
      (getDocs as jest.Mock).mockReturnValue([ {
        id: dataObjectId,
        data: jest.fn().mockReturnValue({ ...dataObject })
      } ])

      dataObjects = await service['queryList']();

      expect(dataObjects).toEqual([ { id: dataObjectId, ...dataObject } ]);
      expect(service['refreshed']).toBe(true);
    });

    it('should log quota exceeded error', async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error('Quota exceeded.'));

      await service['queryList']();

      expect(loggerSpy).toBeCalledWith(new QuotaExceededError());
    })

    it('should throw unknown error', async () => {
      (getDocs as jest.Mock).mockRejectedValue(unknownError);

      await expect(async () => {
        await service['queryList']()
      })
        .rejects
        .toThrow(unknownError);
    })
  })

  describe('promiseQueryList', () => {
    it('should be store and execute promise', async () => {
      const query = { where: 1 } as unknown as QueryConstraint;
      const spyQueryList = jest.spyOn(service, 'queryList' as never).mockResolvedValue([] as never);

      await service['promiseQueryList'](query);
      expect(spyQueryList).toBeCalledWith(query);
    });

    it('should be use and execute promise stored', async () => {
      const query = { where: 1 } as unknown as QueryConstraint;
      const sign = JSON.stringify([ query ]);
      const spyQueryList = jest.spyOn(service, 'queryList' as never);
      const data = [ { id: '1' }, { id: '2' } ];

      service['promises'][sign] = new Promise<DataObjectInterface[]>(resolve => {
        expect(service['promises'][sign]).toBeUndefined();
        resolve(data);
      });
      const dataReturned = await service['promiseQueryList'](query);

      expect(spyQueryList).not.toBeCalled();
      expect(dataReturned).toEqual(data);
      expect.assertions(3);
    });
  })

  describe('findOneBySlug', () => {
    it('should be return object by slug', async () => {

      (getDocs as jest.Mock).mockReturnValue([ {
        id: dataObjectId,
        data: jest.fn().mockReturnValue({ ...dataObject })
      } ])

      const dataObjectReturned = await service['findOneBySlug']('test');
      expect(dataObjectReturned).toEqual({ id: dataObjectId, ...dataObject });
    });

    it('should be throw a DocumentNotFoundError', async () => {
      (getDocs as jest.Mock).mockReturnValue([])

      await expect(async () => {
        await service['findOneBySlug']('test')
      })
        .rejects
        .toThrow(DocumentNotFound);
    });

    it('should log unknown error', async () => {
      const slug = 'test';
      (getDocs as jest.Mock).mockRejectedValue(unknownError);

      await expect(async () => {
        await service['findOneBySlug'](slug)
      })
        .rejects
        .toThrow(DocumentNotFound);

      expect(loggerSpy).toBeCalledWith(new DatabaseError(unknownError.message, { slug }));
    })
  })

  describe('exist', () => {
    it('should be return false if no name', async () => {
      expect(await service.exist('')).toBe(false);
    });
    it('should be return false if object don\'t exist', async () => {
      (getDocs as jest.Mock).mockReturnValue([])

      expect(await service.exist('test')).toBe(false);
    });
    it('should be return true if object exist', async () => {
      (getDocs as jest.Mock).mockReturnValue([ {
        id: dataObjectId,
        data: jest.fn().mockReturnValue({ ...dataObject })
      } ])

      expect(await service.exist('1')).toBe(true);
    });
  })

  describe('findOneById', () => {
    it('should log unknown error', async () => {
      const slug = 'test';
      (getDoc as jest.Mock).mockRejectedValue(unknownError);

      await expect(async () => {
        await service['findOneById'](slug)
      })
        .rejects
        .toThrow(DocumentNotFound);
      expect(loggerSpy).toBeCalledWith(new DatabaseError(unknownError.message, { slug }));
    });
    it('should throw document not found error with document null', async () => {
      (getDoc as jest.Mock).mockReturnValue(null);

      await expect(async () => {
        await service['findOneById']('test')
      })
        .rejects
        .toThrow(DocumentNotFound);
    });
    it('should throw document not found error with data null', async () => {
      (getDoc as jest.Mock).mockReturnValue({ id: dataObjectId, data: jest.fn().mockReturnValue(null) })

      await expect(async () => {
        await service['findOneById']('test')
      })
        .rejects
        .toThrow(DocumentNotFound);
    });
    it('should return object', async () => {
      (getDoc as jest.Mock).mockReturnValue({ id: dataObjectId, data: jest.fn().mockReturnValue({ ...dataObject }) })

      await expect(await service['findOneById']('test')).toEqual({ id: dataObjectId, ...dataObject })
    });
  })

  describe('updateSlug', () => {
    it('should throw EmptyDocument if no name', () => {
      expect(() => {
        service['updateSlug']({ id: '1' });
      })
        .toThrow(EmptyDocument);
    })
    it('should update slug', () => {
      const name = 'CECI est un %test%';
      const slug = slugify(name);
      const object = { name }
      service['updateSlug'](object);
      expect(object).toEqual({ ...object, slug });
    })
  })

  describe('addOne', () => {
    it('should throw unknown error', async () => {
      (setDoc as jest.Mock).mockRejectedValue(unknownError);
      jest.spyOn(service, 'findOneById' as never).mockImplementation()

      await service['addOne']({ ...dataObject })
      expect(loggerSpy).toBeCalledWith(new DatabaseError(unknownError.message, dataObject));
    })

    it('should add object', async () => {
      (setDoc as jest.Mock).mockImplementation();
      jest.spyOn(service, 'findOneById' as never).mockReturnValue(dataObject as never);

      service['synchronized'] = true;
      const dataObjectReturned = await service['addOne']({ ...dataObject });
      expect(dataObjectReturned).toEqual(dataObject);
      expect(service['synchronized']).toBe(false);
    })
  })

  describe('updateOne', () => {
    it('should throw document not found error if no id', async () => {
      await expect(async () => {
        await service['updateOne'](dataObject)
      })
        .rejects
        .toThrow(DocumentNotFound);
    })

    it('should throw unknown error', async () => {
      (setDoc as jest.Mock).mockRejectedValue(unknownError);
      jest.spyOn(service, 'findOneById' as never).mockImplementation()

      await service['updateOne']({ id: dataObjectId, ...dataObject })
      expect(loggerSpy).toBeCalledWith(new DatabaseError(unknownError.message, dataObject));
    })

    it('should update object', async () => {
      (setDoc as jest.Mock).mockImplementation();
      jest.spyOn(service, 'findOneById' as never).mockReturnValue(dataObject as never);

      service['synchronized'] = true;
      const dataObjectReturned = await service['updateOne']({ id: dataObjectId, ...dataObject })
      expect(service['synchronized']).toBe(false);
      expect(dataObjectReturned).toEqual(dataObject);
    })
  })

  describe('removeOne', () => {
    it('should throw document not found error if no id', async () => {
      await expect(async () => {
        await service['removeOne'](dataObject)
      })
        .rejects
        .toThrow(DocumentNotFound);
    })

    it('should throw unknown error', async () => {
      (deleteDoc as jest.Mock).mockRejectedValue(unknownError);
      jest.spyOn(service, 'findOneById' as never).mockImplementation()

      await service['removeOne']({ id: dataObjectId, ...dataObject })
      expect(loggerSpy).toBeCalledWith(new DatabaseError(unknownError.message, dataObject));
    })

    it('should work fine', async () => {
      (deleteDoc as jest.Mock).mockImplementation();

      service['synchronized'] = true;
      await service['removeOne']({ id: dataObjectId, ...dataObject })
      expect(service['synchronized']).toBe(false);
    })
  })
});
