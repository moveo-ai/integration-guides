import { renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import initFacebookSDK, * as facebook from '../../lib/facebook';
import { sleep } from '../../util/util';
import useWebview from '../useWebview';

jest.mock('../../lib/facebook');

const createLocationFromUrl = (url: string) =>
  new URL(url) as unknown as Location;

describe('useWebview', () => {
  const server = setupServer(
    rest.post(
      'https://channels.moveo.ai/v1/facebook/i1/webview',
      (req, res, ctx) => res(ctx.json(req.body))
    ),

    // Mock signing requests
    rest.get(`/api/auth/sign-request`, (req, res, ctx) =>
      res(ctx.json({ token: 'sign-token' }))
    )
  );

  const oldWindowLocation = window.location;
  let getPageContextSpy;

  const pageContext: FacebookPageContext = {
    thread_type: 'USER_TO_PAGE',
    tid: 'tid',
    psid: 'page_id',
    signed_request: 'sign',
  };

  beforeAll(() => {
    getPageContextSpy = jest
      .spyOn(facebook, 'getPageContext')
      .mockReturnValue(pageContext);
    return server.listen();
  });

  afterAll(() => {
    // restore `window.location`
    window.location = oldWindowLocation;
    return server.close();
  });

  test('without a channel in the url', async () => {
    delete window.location;
    window.location = createLocationFromUrl('https://moveo.ai/');
    renderHook(() => useWebview('demo'));
    expect(initFacebookSDK).not.toHaveBeenCalled();
    expect(getPageContextSpy).not.toHaveBeenCalled();
    await sleep(1);
  });

  test('facebook with missing parameters', async () => {
    delete window.location;
    window.location = createLocationFromUrl(
      'https://moveo.ai/?channel=facebook'
    );

    const { result } = renderHook(() => useWebview('demo'));

    expect(typeof result.current.closeWebview).toBe('function');
    expect(typeof result.current.sendContext).toBe('function');

    expect(initFacebookSDK).toHaveBeenCalledTimes(1);

    await expect(result.current.sendContext({ x: 2 })).rejects.toThrow(
      /Missing required parameters/
    );

    await sleep(1);
  });

  test('facebook send context', async () => {
    delete window.location;
    window.location = createLocationFromUrl(
      'https://moveo.ai/?channel=facebook&integration_id=i1&session_id=s1&user_id=u1'
    );

    const { result } = renderHook(() => useWebview('demo'));

    expect(typeof result.current.closeWebview).toBe('function');
    expect(typeof result.current.sendContext).toBe('function');
    expect(typeof result.current.getSupportedFeatures).toBe('function');
    expect(result.current.missingParameters).toEqual(null);

    expect(initFacebookSDK).toHaveBeenCalledTimes(1);

    const response = await result.current.sendContext({ x: 2 });

    expect(getPageContextSpy).toHaveBeenCalled();
    expect(response).toMatchObject({
      context: { x: 2 },
      trigger_node_id: null,
      user_id: 'u1',
      page: pageContext,
    });

    await sleep(1);
  });
});
