import { AssertDataPipe } from './assert-data.pipe';

describe('AssertDataPipe', () => {
  it('create an instance', () => {
    const pipe = new AssertDataPipe();
    expect(pipe).toBeTruthy();
  });
});
