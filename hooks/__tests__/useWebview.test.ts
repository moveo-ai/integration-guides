import { renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import initFacebookSDK, * as facebook from '../../lib/facebook';
import { sleep } from '../../util/util';
import useWebview from '../useWebview';

jest.mock('../../lib/facebook');

// jsdom's window.location cannot be reassigned, so navigate with history.
// This keeps the localhost origin, so the request URLs below are localhost/dev.
const mockWindowLocation = (url: string) => {
  const { pathname, search } = new URL(url);
  window.history.replaceState({}, '', pathname + search);
};

describe('useWebview', () => {
  const server = setupServer(
    // localhost origin -> relative sign-request resolves against it
    http.get('/api/auth/sign-request', () =>
      HttpResponse.json({ token: 'sign-token' })
    ),
    http.get('http://localhost/api/auth/sign-request', () =>
      HttpResponse.json({ token: 'sign-token' })
    ),
    // getIntegrationUrl('localhost') returns the dev channels host
    http.post(
      'https://channels.dev.moveo.ai/v1/facebook/i1/webview',
      async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
      }
    )
  );

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

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    return server.close();
  });

  test('without a channel in the url', async () => {
    mockWindowLocation('https://moveo.ai/');
    renderHook(() => useWebview('demo'));
    expect(initFacebookSDK).not.toHaveBeenCalled();
    expect(getPageContextSpy).not.toHaveBeenCalled();
    await sleep(1);
  });

  test('facebook with missing parameters', async () => {
    mockWindowLocation('https://moveo.ai/?channel=facebook');

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
    mockWindowLocation(
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
