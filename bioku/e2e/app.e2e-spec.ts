import { BiokuPage } from './app.po';

describe('bioku App', function() {
  let page: BiokuPage;

  beforeEach(() => {
    page = new BiokuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
