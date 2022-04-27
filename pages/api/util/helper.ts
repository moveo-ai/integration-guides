import crypto from 'crypto';
import { NextApiRequestWithLog } from '../../../types/moveo';
import { AuthorizationError } from '../../../util/errors';

export function encodeHMAC(data: crypto.BinaryLike, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export const X_MOVEO_SIGNATURE = 'x-moveo-signature';

/**
 * Verifies the X-Moveo-Signature header against the raw body signed with HMAC.
 */
export const checkHmacSignature = (
  req: NextApiRequestWithLog,
  secret: string
) => {
  const bodyAsString = Buffer.from(req.rawBody as never).toString('utf-8');
  const requiredSignature = req?.headers[X_MOVEO_SIGNATURE];

  const signature = encodeHMAC(bodyAsString, secret);

  req.log.info(
    { requiredSignature, generatedSignature: signature },
    'hmac parameters'
  );

  if (requiredSignature != signature) {
    req.log.warn(
      { requiredSignature, signature },
      'Unable to process request: missmatched signatures'
    );
    throw new AuthorizationError();
  }

  req.body = JSON.parse(bodyAsString);
};

/**
 * Returns the base64 encoded private key
 */
export const getPrivateKeyFromEnv = () => process.env.PRIVATE_RSA_KEY;
