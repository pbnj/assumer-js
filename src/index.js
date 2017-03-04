const AWS = require('aws-sdk');

/**
 * Assumes AWS IAM Roles in Control Account, then in Target Account
 * @param {object} opts - The opts for configuration
 * @param {string} opts.ctrlAcct - Control Account Number
 * @param {string} opts.ctrlRole - Control Account Role
 * @param {string} opts.trgtAcct - Target Account Number
 * @param {string} opts.trgtRole - Target Account Role
 * @param {string} opts.username - IAM username
 * @param {string} opts.mfaToken - MFA Token
 */
module.exports = opts => new Promise((resolve, reject) => {
  if (typeof opts === 'undefined') reject(new Error('Must provide Control Account Number, Control Account Role, Target Account Number, and Target Account Role.'));
  const { ctrlAcct, ctrlRole, trgtAcct, trgtRole, username, mfaToken } = opts;

  const ctrlParams = {
    RoleArn: `arn:aws:iam::${ctrlAcct}:role/${ctrlRole}`,
    RoleSessionName: 'AssumedRole',
    SerialNumber: `arn:aws:iam::${ctrlAcct}:mfa/${username}`,
    TokenCode: `${mfaToken}`,
  };
  const ctrlSTS = new AWS.STS();
  ctrlSTS.assumeRole(ctrlParams, (ctrErr, ctrlCreds) => {
    if (ctrErr) reject(ctrErr);

    AWS.config.credentials = ctrlSTS.credentialsFrom(ctrlCreds);

    const trgtParams = {
      RoleArn: `arn:aws:iam::${trgtAcct}:role/${trgtRole}`,
      RoleSessionName: 'AssumedRole',
    };

    new AWS.STS().assumeRole(trgtParams, (trgtErr, trgtCreds) => {
      if (trgtErr) reject(trgtErr);
      resolve(trgtCreds.Credentials);
    });
  });
});
