![](./integration-guides.png)

Templates, examples and guides around adding your own Webhooks and Webviews into your Moveo Virtual Assistant.

[Webview documentation](https://docs.moveo.ai/docs/get_started/response_webview)

[Webhook documentation](https://docs.moveo.ai/docs/get_started/response_webhook)

## Getting started

1. Install dependencies using:

```sh
npm install --legacy-peer-deps
```

2. Run a local server listening on `localhost:3000` by executing:

```sh
npm run dev
# or
yarn dev
```

## Directory structure

This is a next.js project where webhooks and webviews are stored under the `/pages` directory

```
pages
├── _app.tsx
├── _document.tsx
├── api                                    // Webhooks are stored under the /api folder
│   ├── auth
│   │   └── sign-request.ts
│   ├── common
│   │   └── random-number-generator.ts     // Returns a random number in the VA context
│   ├── ecommerce
│   │   ├── purchases-get-recent.ts        // Returns a carousel of recent purchases along with context variables
│   │   └── util
│   │       ├── api.ts
│   │       ├── helper.ts
│   │       ├── models.ts
│   │       └── purchases.ts
│   └── util
│       └── helper.ts
├── demo
│   └── demoForm.tsx                       // Webviews are stored under the /demo folder
├── web-client
│   └── web-client-instance.tsx            // Web-client example ( hosted as a webview )
└── index.tsx
```

## Code style

- Filenames should be **kebab-case**: `send-email-to-panos.ts` not `sendEmail_ToPanos.ts`
- Moveo context is **snake_case**: `withdrawl_amount: 30` not `withdrawlAmounT: 30`

## Webhooks

Webhooks are HTTP endpoints that expose an API used by Moveo to communicate with 3rd party tools.
Customers usually have APIs that the VA can call to then augment the session context and return responses.
In some cases, Webhooks are used to send emails or add data to a Google spreadsheet.

After running your local server using (ie. `npm run dev`) you can "mimick" the VA calls to the webhooks using curl.
For example you can get a random number by executing:

```shell script
curl -X POST \
-H "Content-Type: application/json" \
-H "X-Moveo-Signature: 7b2e526f80d3ad094ee0a2ccc2501afdab7044f89839f9fcba9466d15a967774" \
-d '{"lang": "el", "channel":"web", "context": {"firstname": "John", "lastname": "Snow"}}' "localhost:3000/api/common/random-number-generator?max=100&min=1"
```

## Webviews

Webviews are HTML pages that display information such as a Google Map or a form. The data is usually context that is retrieved and updated based on a Moveo session.

RSA keys are used to encrypt information between your custom webview form and the VA.

The RSA keys used for authentication in this repository:

Public RSA Key:

```text
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnhZar+5yfwp+9VSr61/U
5VKQDd6z2kdKn+mHRB+SlJA7840nSbZieA4t0g2xls2N+OcJZP1CkZdCkDR2M8bv
tKkIexc9UCnWEM9SSoOKt+XcePUxBhqgYwmuHmk6tI0afePhNagrgdntoi54dKmA
cnHAtKsxqRuDZZoQTeGO/ZqMyI+ygidXhY5Bw2a+bD1Z9LlTqhWAcIlkqZO3c7gc
t565X3eoCByuzIncQZqG+vFvpg2WhTSayeALLVD3XlZPvQZC92jvmAcdukuPvbo7
JkPAVpD/yvBb3i3Txt+Zy2vNfP3knHwZyyvh0o1xEJSLwSd/iF+r9vhNetpq6JE4
JwIDAQAB
-----END PUBLIC KEY-----
```

Base64 encoded Public Key

```text
LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFuaFphcis1eWZ3cCs5VlNyNjEvVQo1VktRRGQ2ejJrZEtuK21IUkIrU2xKQTc4NDBuU2JaaWVBNHQwZzJ4bHMyTitPY0paUDFDa1pkQ2tEUjJNOGJ2CnRLa0lleGM5VUNuV0VNOVNTb09LdCtYY2VQVXhCaHFnWXdtdUhtazZ0STBhZmVQaE5hZ3JnZG50b2k1NGRLbUEKY25IQXRLc3hxUnVEWlpvUVRlR08vWnFNeUkreWdpZFhoWTVCdzJhK2JEMVo5TGxUcWhXQWNJbGtxWk8zYzdnYwp0NTY1WDNlb0NCeXV6SW5jUVpxRyt2RnZwZzJXaFRTYXllQUxMVkQzWGxaUHZRWkM5Mmp2bUFjZHVrdVB2Ym83CkprUEFWcEQveXZCYjNpM1R4dCtaeTJ2TmZQM2tuSHdaeXl2aDBvMXhFSlNMd1NkL2lGK3I5dmhOZXRwcTZKRTQKSndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t
```

Private RSA key

```text
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAnhZar+5yfwp+9VSr61/U5VKQDd6z2kdKn+mHRB+SlJA7840n
SbZieA4t0g2xls2N+OcJZP1CkZdCkDR2M8bvtKkIexc9UCnWEM9SSoOKt+XcePUx
BhqgYwmuHmk6tI0afePhNagrgdntoi54dKmAcnHAtKsxqRuDZZoQTeGO/ZqMyI+y
gidXhY5Bw2a+bD1Z9LlTqhWAcIlkqZO3c7gct565X3eoCByuzIncQZqG+vFvpg2W
hTSayeALLVD3XlZPvQZC92jvmAcdukuPvbo7JkPAVpD/yvBb3i3Txt+Zy2vNfP3k
nHwZyyvh0o1xEJSLwSd/iF+r9vhNetpq6JE4JwIDAQABAoIBAFi8rY0BqK1dA+TL
8XC+qy9KR+gxMP1+dQoMOMxpeIsB51UPz5TV1rITK280FpJSsbWcYi6Y5qv4nvl5
KTxpF5ZuJ3+IjPcZdLqc1VFUQyJ02WvgHfOSMKNHBMC3SqecaNlvd7P5wOoznOsj
cKPznVEgPw5q5gZJllkKwMomqW/6VcpW0GiolwP8TdQFv1/847Edc10EwrWFf1aC
LQ/J2Hs3dcttSk0oLj3w8AZHlY4YFZ2pWcuZW6wSBcBT3bmo9ING9XiSwtv6Vxsq
c8W/Nb+PeWQhol71ozosJR9nOhWsYKQoJ0nYuL49WuBCU4AFq+TjRy1YIqU4KfhV
HGE1U1kCgYEAzvJCXckn3zp/5k5OlPFW85J5VLrWR7FLVfsQ+a12RjimT4PulOye
jGqp9vHcBUvPp32WqQCPjEcXpXeure1VveqGIS8sRdrFjyKyVU/ZM2eUraFIkgrl
wR3/EsTMqvA96f4hMcIGzKz1OwrzNgte7eb/eMD1AEeWjFtq7aj6YVUCgYEAw49G
RrtX1ljFH0t0bap/YaUKkYPnYV8haIBOdFuBz1WycqXFEBymyTAvrHnbDa/mY5Tp
3bi7TXrNj+Y89PEa+IVyiS6UwPaVMH8M4w0GKPDXuIeKl1jItWepbL61ZqRMKjyg
wgKQD7ZWCupHFFGsa8AmQimeoF/Qb4Z5/9MQ44sCgYBAC2VSlQBL61TNt4pGOfJI
6xm1iSTrhwjjkRGN04r47Gs7zH63hAsFNbVoAS2wTefz08AeiVfjd9TvlnxuwzZ3
0e60sl6nN69QPtKl6FI1wGaY3YMR/2FfRKM98b3NYRAoLEelmIB2M0ipfxgJr7cv
NP/3JPAtp/oFcf1Dk7n5CQKBgCo3j/BNGVVIrKVo4KWcHQuzWWi4lQbMRqYMrOMp
rghYc8GUT8p+pPLh2Cjf1Y5K3u24hBQ9gRHk5OOfzKEEO9JS3LsIt0xA70wc4WdS
tHW6KJfJiv3JSOsAie7T7M1PwrGLjRjU/MynjEOm99lHGHXacWfvHDN6+8BXw5aa
thapAoGBAIbKE0dVwgzdu6b0vxSIlr/m5CLwdr3lSiHKHZ6wP2sbrbrwZGgLAnbd
XDQX90sJid5Yzegzqk3IWuO1+/BWwRYrgm0hTIn7TeujW4NViUGEXNJxDHv5MRVx
Wlqb8Llg36ns/yH1bzvhWdYhyW3UU3tQQ1z99tOwJ1HT7ufD9kiN
-----END RSA PRIVATE KEY-----
```

Base64 encoded Private Key

```text
LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBbmhaYXIrNXlmd3ArOVZTcjYxL1U1VktRRGQ2ejJrZEtuK21IUkIrU2xKQTc4NDBuClNiWmllQTR0MGcyeGxzMk4rT2NKWlAxQ2taZENrRFIyTThidnRLa0lleGM5VUNuV0VNOVNTb09LdCtYY2VQVXgKQmhxZ1l3bXVIbWs2dEkwYWZlUGhOYWdyZ2RudG9pNTRkS21BY25IQXRLc3hxUnVEWlpvUVRlR08vWnFNeUkreQpnaWRYaFk1QncyYStiRDFaOUxsVHFoV0FjSWxrcVpPM2M3Z2N0NTY1WDNlb0NCeXV6SW5jUVpxRyt2RnZwZzJXCmhUU2F5ZUFMTFZEM1hsWlB2UVpDOTJqdm1BY2R1a3VQdmJvN0prUEFWcEQveXZCYjNpM1R4dCtaeTJ2TmZQM2sKbkh3Wnl5dmgwbzF4RUpTTHdTZC9pRityOXZoTmV0cHE2SkU0SndJREFRQUJBb0lCQUZpOHJZMEJxSzFkQStUTAo4WEMrcXk5S1IrZ3hNUDErZFFvTU9NeHBlSXNCNTFVUHo1VFYxcklUSzI4MEZwSlNzYldjWWk2WTVxdjRudmw1CktUeHBGNVp1SjMrSWpQY1pkTHFjMVZGVVF5SjAyV3ZnSGZPU01LTkhCTUMzU3FlY2FObHZkN1A1d09vem5Pc2oKY0tQem5WRWdQdzVxNWdaSmxsa0t3TW9tcVcvNlZjcFcwR2lvbHdQOFRkUUZ2MS84NDdFZGMxMEV3cldGZjFhQwpMUS9KMkhzM2RjdHRTazBvTGozdzhBWkhsWTRZRloycFdjdVpXNndTQmNCVDNibW85SU5HOVhpU3d0djZWeHNxCmM4Vy9OYitQZVdRaG9sNzFvem9zSlI5bk9oV3NZS1FvSjBuWXVMNDlXdUJDVTRBRnErVGpSeTFZSXFVNEtmaFYKSEdFMVUxa0NnWUVBenZKQ1hja24zenAvNWs1T2xQRlc4NUo1VkxyV1I3RkxWZnNRK2ExMlJqaW1UNFB1bE95ZQpqR3FwOXZIY0JVdlBwMzJXcVFDUGpFY1hwWGV1cmUxVnZlcUdJUzhzUmRyRmp5S3lWVS9aTTJlVXJhRklrZ3JsCndSMy9Fc1RNcXZBOTZmNGhNY0lHekt6MU93cnpOZ3RlN2ViL2VNRDFBRWVXakZ0cTdhajZZVlVDZ1lFQXc0OUcKUnJ0WDFsakZIMHQwYmFwL1lhVUtrWVBuWVY4aGFJQk9kRnVCejFXeWNxWEZFQnlteVRBdnJIbmJEYS9tWTVUcAozYmk3VFhyTmorWTg5UEVhK0lWeWlTNlV3UGFWTUg4TTR3MEdLUERYdUllS2wxakl0V2VwYkw2MVpxUk1LanlnCndnS1FEN1pXQ3VwSEZGR3NhOEFtUWltZW9GL1FiNFo1LzlNUTQ0c0NnWUJBQzJWU2xRQkw2MVROdDRwR09mSkkKNnhtMWlTVHJod2pqa1JHTjA0cjQ3R3M3ekg2M2hBc0ZOYlZvQVMyd1RlZnowOEFlaVZmamQ5VHZsbnh1d3paMwowZTYwc2w2bk42OVFQdEtsNkZJMXdHYVkzWU1SLzJGZlJLTTk4YjNOWVJBb0xFZWxtSUIyTTBpcGZ4Z0pyN2N2Ck5QLzNKUEF0cC9vRmNmMURrN241Q1FLQmdDbzNqL0JOR1ZWSXJLVm80S1djSFF1eldXaTRsUWJNUnFZTXJPTXAKcmdoWWM4R1VUOHArcFBMaDJDamYxWTVLM3UyNGhCUTlnUkhrNU9PZnpLRUVPOUpTM0xzSXQweEE3MHdjNFdkUwp0SFc2S0pmSml2M0pTT3NBaWU3VDdNMVB3ckdMalJqVS9NeW5qRU9tOTlsSEdIWGFjV2Z2SERONis4Qlh3NWFhCnRoYXBBb0dCQUliS0UwZFZ3Z3pkdTZiMHZ4U0lsci9tNUNMd2RyM2xTaUhLSFo2d1Ayc2JyYnJ3WkdnTEFuYmQKWERRWDkwc0ppZDVZemVnenFrM0lXdU8xKy9CV3dSWXJnbTBoVEluN1RldWpXNE5WaVVHRVhOSnhESHY1TVJWeApXbHFiOExsZzM2bnMveUgxYnp2aFdkWWh5VzNVVTN0UVExejk5dE93SjFIVDd1ZkQ5a2lOCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg
```

## Web Client

The web-client is the integration for the web.

After running the local server, you can see how to initialize the web-client using your `integrationId`, and customize its behavior
![](./web-client.gif)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!.
