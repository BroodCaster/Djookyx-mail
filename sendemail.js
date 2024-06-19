import dotenv from 'dotenv'
import Mailgun from 'mailgun-js';
import {
  AccountAddress,
  AccountTransactionType,
  buildAccountSigner,
  CcdAmount,
  Energy,
  ModuleReference,
  serializeUpdateContractParameters,
  signTransaction,
  TransactionExpiry,
  unwrap,
  ContractName,
  ContractAddress,
  ReceiveName,
} from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient } from '@concordium/web-sdk/nodejs';
import { credentials } from '@grpc/grpc-js';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config()

const mg = Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const address = process.env.NODE_ADDRESS;
const port = process.env.NODE_PORT;

const concordiumClient = new ConcordiumGRPCNodeClient(
    address,
    Number(port),
    credentials.createInsecure()
);

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  });

  const sender = AccountAddress.fromBase58('3R6pTFtGMmBANxSp33t9YyZc6Q65nZFoDYqCU5fGx8ZueFkXGh');
  const privateKey = process.env.PRIVATE_KEY;
  const signer = buildAccountSigner(privateKey);
  const moduleRef = ModuleReference.fromHexString(
      '0c436c6cde7cef6a13c0a1a84221e62e927630d5a922c1f2ec716a3dc1245823'
  );
  const schema = await concordiumClient.getEmbeddedSchema(moduleRef);
  const contractName = ContractName.fromStringUnchecked('auction_nft_contract');
  const receiveName = ReceiveName.fromStringUnchecked('auction_nft_contract.mint');
  const contractAddress = ContractAddress.create(9330, 0);
  const entrypoint = ReceiveName.fromStringUnchecked("mint");
  const maxCost = Energy.create(30000);

  const emailTemplate = `
  <table border="0" cellpadding="0" cellspacing="0" class="body" style="background-color:#eaebed; border-collapse:separate; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
  <tbody>
      <tr>
          <td style="vertical-align:top">&nbsp;</td>
          <td style="background-color:#fafafa; border-radius:10px; height:800px; vertical-align:top; width:800px">
          <div class="header" style="padding:0 0 20px 0; z-index:5">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
              <tbody>
                  <tr>
                      <td style="text-align:center; vertical-align:top"><!-- <div style="height:265px; width:800px;"></div> --></td>
                  </tr>
              </tbody>
          </table>
          </div>

          <div class="content" style="box-sizing:border-box; display:block; height:100%; margin-bottom:0px; margin-left:0px; margin-right:0px; margin-top:0px; z-index:100"><!-- START CENTERED WHITE CONTAINER --><span style="color:transparent">Hi there!</span>

          <table class="main-text-mail-wrapper" style="background:#ffffff; border-collapse:separate; border-radius:23px; box-sizing:border-box; height:auto; margin-left:auto; margin-right:auto; max-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; padding:10px 10px 20px 10px; width:100%">
              <tbody>
                  <tr>
                      <td style="background-color:#ffffff; border-radius:23px; height:100%; vertical-align:top; width:100%">
                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate; min-height:515px; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
                          <tbody>
                              <tr>
                                  <td style="vertical-align:top">
                                  <div class="background-image" style="background-image:url('https://cdn.djooky.fun/2021-12-05-17-14-52-2021-11-29-10-44-10-Rectangle%201377.jpg'); background-repeat:no-repeat; border-radius:23px; height:132; text-align:center;  z-index:1"><a class="djooky-logo" href="https://djookyx.com/" style="color: #ec0867; text-decoration: underline; display: block; box-sizing: border-box; padding: 40px 0 40px 0; z-index: 2;"><img src="https://cdn.djooky.fun/2022-08-29-21-13-14-main-logo.png" style="-ms-interpolation-mode:bicubic; border:none; max-width:100%" /></a></div>

                                  <div class="main-content" style="height:100%; margin-bottom:60px; margin-left:auto; margin-right:auto; margin-top:60px; max-width:580px; min-height:250px">
                                  <p style="margin-left:0px; margin-right:0px; text-align:center; font-weight:bold;font-size: 22px;">DjookyX: Own a Piece of Music History  </p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">You are privileged to be personally invited to the Kler's song auction.</p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">Participate in the world's first fully compliant on-chain registered auction of music rights.</p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">Own a part of a song that has touched millions of hearts.</p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">Kler'sauction now live, starting at 0.11 Euro per right. </p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">Receive NFTs and gain early mover advantages for the upcoming web3 version.</p>
                                  <p style="margin-left:0px; margin-right:0px; text-align:center">Don't miss out! Visit <a href="https://djookyx.com/" style="color: #FF0090; font-weight: bold; text-decoration: none;">djookyx.com</a>, register, and join the auction today.</p><table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse:separate; box-sizing:border-box; margin-left:auto; margin-right:auto; margin-top:50px; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
                                      <tbody>
                                          <tr>
                                              <td style="vertical-align:top">
                                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate; margin-left:auto; margin-right:auto; min-width:auto; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto">
                                                  <tbody>
                                                      <tr>
                                                          <td style="background-color:#ff0090; border-radius:10px; text-align:center; vertical-align:top"><a href="{{LINK}}" style="border: solid 1px #FF0090; border-radius: 10px; box-sizing: border-box; cursor: pointer; display: inline-block; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; font-weight: bold; font-size: 14px; line-height: 17px; text-align: center; background-color: #FF0090; color: #FFFFFF;" target="_blank">Create account</a></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                                      <p style="margin-left:0px; margin-right:0px; text-align:center"><br></p>
                                          <p style="margin-left:0px; margin-right:0px; text-align:center; font-weight:bold;">Join our Telegram forum for more insights: <a href="https://t.me/+uCaBO7IVQWM4MDBi" style="color: #FF0090; font-weight: bold; text-decoration: none;"> https://t.me/+uCaBO7IVQWM4MDBi</a></p>
                                          <p style="margin-left:0px; margin-right:0px; text-align:center">#DjookyX #Concordium #MusicRevolution #FractionalSongRights #NFTs</p>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      </td>
                  </tr>
                  <!-- END MAIN CONTENT AREA -->
              </tbody>
          </table>

          <div class="footer" style="margin-bottom:35px; margin-left:35px; margin-right:35px; margin-top:35px">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
              <tbody>
                  <tr>
                      <td style="text-align:left; vertical-align:top; width:50%">
                      <p style="margin-left:0px; margin-right:0px; text-align:left">Connect with us:</p>

                      <div class="icon-wrap" style="margin-bottom:10px"><a class="connect_us-icon" href="https://www.facebook.com/djooky/" style="text-decoration: underline; margin-right: 10px; box-sizing: border-box; display: inline-block; font-size: 12px; text-align: center; font-weight: 500; color: #2F3539;"><img alt="logo facebook" src="https://cdn.djooky.fun/2021-11-29-18-06-48-facebook.png" style="-ms-interpolation-mode:bicubic; border:none; max-width:100%" /></a> <a class="connect_us-icon" href="https://instagram.com/djookymusic?igshid=8s998x1fvfm5" style="text-decoration: underline; margin-right: 10px; box-sizing: border-box; display: inline-block; font-size: 12px; text-align: center; font-weight: 500; color: #2F3539;"><img alt="logo instagram" src="https://cdn.djooky.fun/2021-11-29-18-07-40-instagram.png" style="-ms-interpolation-mode:bicubic; border:none; max-width:100%" /></a> <a class="connect_us-icon" href="https://www.tiktok.com/@djooky?" style="text-decoration: underline; margin-right: 10px; box-sizing: border-box; display: inline-block; font-size: 12px; text-align: center; font-weight: 500; color: #2F3539;"><img alt="tick logo" src="https://cdn.djooky.fun/2021-11-29-18-08-19-tiktok.png" style="-ms-interpolation-mode:bicubic; border:none; max-width:100%" /></a> <a class="connect_us-icon connect_us-icon-last" href="https://twitter.com/Djooky3" style="text-decoration: underline; margin-right: 10px; box-sizing: border-box; display: inline-block; font-size: 12px; text-align: center; font-weight: 500; color: #2F3539;"><img alt="logo twitter" src="https://cdn.djooky.fun/2021-12-06-12-14-55-twitter.png" style="-ms-interpolation-mode:bicubic; border:none; max-width:100%" /></a></div>
                      </td>
                      <td style="text-align:right; vertical-align:top; width:50%">
                      <p style="margin-left:0px; margin-right:0px; text-align:right">Support e-mail:</p>
                      <a href="mailto:support@djookyx.com" style="text-decoration: underline; font-size: 12px; text-align: center; font-weight: 500; color: #2F3539;">support@djookyx.com</a></td>
                  </tr>
                  <tr>
                      <td style="border-top:1px solid #7d7e7e; text-align:center; vertical-align:top; width:100%">
                      <p style="margin-left:0px; margin-right:0px; text-align:left">Copyright &copy; 2022 Djooky Inc. All rights reserved. Djooky.</p>
                      </td>
                      <td style="border-top:1px solid #7d7e7e; text-align:center; vertical-align:top">&nbsp;</td>
                  </tr>
              </tbody>
          </table>
          </div>
          <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --></div>
          </td>
          <td style="vertical-align:top">&nbsp;</td>
      </tr>
  </tbody>
  </table>
  `;

async function sendEmail(email) {
  const msg = {
    to: email,
    from: 'support@djookyx.com', 
    subject: 'Djookyx invited you to auction!',
    text: 'Check your invitation!',
    html: emailTemplate
  };

  try {
    await mg.messages().send(msg);

    const client = await pool.connect();
    const res = await mintNFT();
    const transactionHash = Buffer.from(res.summary.hash.buffer).toString('hex');
    console.log(transactionHash);
    console.dir(res, { depth: null, colors: true });

    await client.query('UPDATE public."djooky_user_test" SET status = $1, transaction_hash = $2 WHERE email = $3', ['sent', transactionHash, email]);

    console.log('Email sent to: ' + email);

    client.release();
  } catch (error) {
    console.error('Error sending email to ' + email + ':', error);
  }
}

async function mintNFT() {
  let token = Math.floor(Math.random() * (2 ** 32));
    let input = {
      owner: {
        Account: [
          sender
        ]
      },
      tokens: [token.toString(16).toLowerCase()]
    };

    const updateHeader = {
        expiry: TransactionExpiry.futureMinutes(60),
        nonce: (await concordiumClient.getNextAccountNonce(sender)).nonce,
        sender,
    };
    

    const updateParams = serializeUpdateContractParameters(
        contractName,
        entrypoint,
        input,
        schema
    );

    const updatePayload = {
        amount: CcdAmount.zero(),
        address: unwrap(contractAddress),
        receiveName,
        message: updateParams,
        maxContractExecutionEnergy: maxCost,
    };

    const updateTransaction = {
        header: updateHeader,
        payload: updatePayload,
        type: AccountTransactionType.Update,
    };

    const updateSignature = await signTransaction(updateTransaction, signer);

    const updateTrxHash = await concordiumClient.sendAccountTransaction(
        updateTransaction,
        updateSignature
    );

    console.log('Transaction submitted, waiting for finalization...');

    const updateStatus = await concordiumClient.waitForTransactionFinalization(
        updateTrxHash
    );
    return updateStatus;
}

(async () => {
    const client = await pool.connect();

  try {
    const res = await client.query('SELECT email FROM public."djooky_user_test" WHERE status = $1', ['ready']);
    const emails = res.rows;

    for (let row of emails) {
      await sendEmail(row.email);
    }
  } finally {
    client.release();
  }
})();
