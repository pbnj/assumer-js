const AWS = require('aws-sdk');

/**
 * Assumes AWS IAM Roles in Control Account, then in Target Account
 * @param {object} opts - The opts for configuration
 * @param {string} opts.controlAccount - Control Account Number
 * @param {string} opts.controlRole - Control Account Role
 * @param {string} opts.targetAccount - Target Account Number
 * @param {string} opts.targetRole - Target Account Role
 * @param {string} opts.username - IAM username
 * @param {string} opts.mfaToken - MFA Token
 */
module.exports = opts => new Promise((resolve, reject) => {
  if (typeof opts === 'undefined') reject(new Error('Must provide Control Account Number, Control Account Role, Target Account Number, and Target Account Role.'));
  const { controlAccount, controlRole, targetAccount, targetRole, username, mfaToken } = opts;

  const ctrlParams = {
    RoleArn: `arn:aws:iam::${controlAccount}:role/${controlRole}`,
    RoleSessionName: 'AssumedRole',
    SerialNumber: `arn:aws:iam::${controlAccount}:mfa/${username}`,
    TokenCode: `${mfaToken}`,
  };
  const ctrlSTS = new AWS.STS();
  ctrlSTS.assumeRole(ctrlParams, (ctrErr, ctrlCreds) => {
    if (ctrErr) reject(ctrErr);

    AWS.config.credentials = ctrlSTS.credentialsFrom(ctrlCreds);

    const trgtParams = {
      RoleArn: `arn:aws:iam::${targetAccount}:role/${targetRole}`,
      RoleSessionName: 'AssumedRole',
    };

    new AWS.STS().assumeRole(trgtParams, (trgtErr, trgtCreds) => {
      if (trgtErr) reject(trgtErr);
      resolve(trgtCreds.Credentials);
    });
  });
});
