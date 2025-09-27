import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { describe } from 'node:test';
// import { AppService } from './example.dto.ts';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ExampleController],
    }).compile();
  });

  describe('getData', () => {
    it('should return "hello example"', () => {
      const appController = app.get<ExampleController>(ExampleController);
      expect(appController.all()).toEqual({ message: 'hello example' });
    });
  });
});

// VVVV service test
// import { Test } from '@nestjs/testing';
// import { AppService } from './app.service';
//
// describe('AppService', () => {
//   let service: AppService;
//
//   beforeAll(async () => {
//     const app = await Test.createTestingModule({
//       providers: [AppService],
//     }).compile();
//
//     service = app.get<AppService>(AppService);
//   });
//
//   describe('getData', () => {
//     it('should return "Hello API"', () => {
//       expect(service.getData()).toEqual({message: 'Hello API'});
//     });
//   });
// });
