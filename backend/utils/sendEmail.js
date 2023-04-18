const nodemailer = require("nodemailer");
const { emailCredentials } = require("../strings");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: emailCredentials,
});

let baseUrl = "https://impedia.shreyasgupta.in/";

sendPasswordResetEmail = (email, link) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  let text = `A password reset request has been made for your Impedia Account\n\nPlease ignore this email if this was not requested by you\n\nOpen this link to reset your password: ${baseUrl + link}\nThis link will only be valid for 1 hour.`;
  let html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                @media (max-width: 500px) {
                                .form-wrapper {
                                    max-width: 300px;
                                }
                            }
                </style>
            </head>
            <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0;">
            
            <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 100%;padding: .5rem;">
                <center>
                    <div class="container">
                    <a class="navbar-brand" href="#">
                        <img src="https://i.imgur.com/uWemPNc.png" alt="" height="64">
                    </a>
                    </div>
                </center>
            </nav>
            <center>
                <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
                <center>
                        <h1>Reset your password</h1>
                        <p>A password reset request has been made for your Impedia Account</p>
                        <p class="text-muted">Please ignore this email if this was not requested by you</p>
                        <br/>
                        <h4>Click this button to reset your password</h4>
                        <a href="${baseUrl + link}" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Reset Password</a>
                        <br/><br/><br/>
                        <h6>If the button doesn't work, copy and open this link in your browser: ${baseUrl + link}</h6>
                    </center>
                </div>
                </center>
                <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 100%;padding: 0.6em;">
                    <div class="container" style="text-align: center;">
                    <p style="margin: 0!important;">&copy; Impedia 2021</p>
                    </div>
                </nav>
            </body>
            </html>`;

  var mailOptions = {
    from: `"Impedia" <${emailCredentials.user}>`,
    to: email,
    subject: "Reset your Impedia Password",
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Some error occured: " + error);
    } else {
      //console.log("Email sent: " + info.response);
    }
  });
};

sendNewAuthorityEmail = (authorityEmail, password) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  let text = `Your organization admin has added you as an authority and thus an Impedia Account has been created for you\n\nHere are your details for logging in:\nEmail: ${authorityEmail}\nPassword: ${password}\n\nYou can log in and start resolving issues made by students addressed to you here: ${
    baseUrl + "login/authority"
  }`;
  let html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Impedia</title>
              <style>
              @media (max-width: 500px) {
                              .form-wrapper {
                                  max-width: 300px;
                              }
                          }
              </style>
          </head>
          <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0;">
          
          <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 100%;padding: .5rem;">
              <center>
                  <div class="container">
                  <a class="navbar-brand" href="#">
                      <img src="https://i.imgur.com/uWemPNc.png" alt="" height="64">
                  </a>
                  </div>
              </center>
          </nav>
          <center>
              <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
              <center>
                      <h1>Welcome to Impedia!</h1>
                      <p>Your organization admin has added you as an authority and thus an Impedia Account has been created for you</p>
                      <br/>
                      <h4>Here are your details for logging in:</h4>
                      <h4>Email: ${authorityEmail}</h4>
                      <h4>Password: ${password}</h4>
                      <a href="${
                        baseUrl + "login/authority"
                      }" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Login to your Account</a>
                      <br/><br/><br/>
                      <h6>If the button doesn't work, copy and open this link in your browser: ${
                        baseUrl + "login/authority"
                      }</h6>
                  </center>
              </div>
              </center>
              <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 100%;padding: 0.6em;">
                  <div class="container" style="text-align: center;">
                  <p style="margin: 0!important;">&copy; Impedia 2021</p>
                  </div>
              </nav>
          </body>
          </html>`;

  var mailOptions = {
    from: `"Impedia" <${emailCredentials.user}>`,
    to: authorityEmail,
    subject: "Welcome to Impedia!",
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Some error occured: " + error);
    } else {
      //console.log("Email sent: " + info.response);
    }
  });
};

sendNewAppealEmail = (authority, student, appeal) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  let text = `Hi ${authority.name}, an appeal has been addressed to you by ${
    student.name
  } with the title: ${
    appeal.title
  }\n\nPlease log in to the Impedia Platform and resolve the issue as soon as possible here: ${
    baseUrl + "login/authority"
  }`;
  let html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Appeal</title>
              <style>
              @media (max-width: 500px) {
                              .form-wrapper {
                                  max-width: 300px;
                              }
                          }
              </style>
          </head>
          <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0;">
          
          <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 100%;padding: .5rem;">
              <center>
                  <div class="container">
                  <a class="navbar-brand" href="#">
                      <img src="https://i.imgur.com/uWemPNc.png" alt="" height="64">
                  </a>
                  </div>
              </center>
          </nav>
          <center>
              <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
              <center>
                      <h1>New Appeal!</h1>
                      <p>Hi ${
                        authority.name
                      }, an appeal has been addressed to you with the following details</p>
                      <h4>Title: ${appeal.title}</h4>
                      <h4>By: ${student.name}</h4>
                      <a href="${
                        baseUrl + "login/authority"
                      }" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Login and Resolve</a>
                      <br/><br/><br/>
                      <h6>If the button doesn't work, copy and open this link in your browser: ${
                        baseUrl + "login/authority"
                      }</h6>
                  </center>
              </div>
              </center>
              <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 100%;padding: 0.6em;">
                  <div class="container" style="text-align: center;">
                  <p style="margin: 0!important;">&copy; Impedia 2021</p>
                  </div>
              </nav>
          </body>
          </html>`;

  var mailOptions = {
    from: `"Impedia" <${emailCredentials.user}>`,
    to: authority.email,
    subject: "New Appeal!",
    text: text,
    html: html,
  };
  /*
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Some error occured: " + error);
    } else {
      //console.log("Email sent: " + info.response);
    }
  });
  */
};

sendNewPetitionEmail = (authority, student, petition) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  let text = `Hi ${authority.name}, a petition has been addressed to you by ${
    student.name
  } with the title: ${
    petition.title
  }\n\nPlease log in to the Impedia Platform and resolve the issue as soon as possible here: ${
    baseUrl + "login/authority"
  }`;
  let html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Petition</title>
              <style>
              @media (max-width: 500px) {
                              .form-wrapper {
                                  max-width: 300px;
                              }
                          }
              </style>
          </head>
          <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0;">
          
          <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 100%;padding: .5rem;">
              <center>
                  <div class="container">
                  <a class="navbar-brand" href="#">
                      <img src="https://i.imgur.com/uWemPNc.png" alt="" height="64">
                  </a>
                  </div>
              </center>
          </nav>
          <center>
              <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
              <center>
                      <h1>New Petition!</h1>
                      <p>Hi ${
                        authority.name
                      }, a petition has been addressed to you with the following details</p>
                      <h4>Title: ${petition.title}</h4>
                      <h4>By: ${student.name}</h4>
                      <a href="${
                        baseUrl + "login/authority"
                      }" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Login and Resolve</a>
                      <br/><br/><br/>
                      <h6>If the button doesn't work, copy and open this link in your browser: ${
                        baseUrl + "login/authority"
                      }</h6>
                  </center>
              </div>
              </center>
              <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 100%;padding: 0.6em;">
                  <div class="container" style="text-align: center;">
                  <p style="margin: 0!important;">&copy; Impedia 2021</p>
                  </div>
              </nav>
          </body>
          </html>`;

  var mailOptions = {
    from: `"Impedia" <${emailCredentials.user}>`,
    to: authority.email,
    subject: "New Petition!",
    text: text,
    html: html,
  };
  /*
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Some error occured: " + error);
    } else {
      //console.log("Email sent: " + info.response);
    }
  });
  */
};

sendNewReplyEmail = (email, type, gist, replier, replyGist) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  let text = `Hi! You have a new reply to your ${type}, "${gist}...", by ${replier}: "${replyGist}..."\n\nPlease log in to the Impedia Platform and to view it here: ${baseUrl}`;
  let html = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Petition</title>
              <style>
              @media (max-width: 500px) {
                              .form-wrapper {
                                  max-width: 300px;
                              }
                          }
              </style>
          </head>
          <body style="position: relative;font-family: 'Verdana', sans-serif;padding: 0;margin: 0;">
          
          <nav class="navbar header navbar-dark bg-dark" style="position: absolute;top: 0;width: 100%;padding: .5rem;">
              <center>
                  <div class="container">
                  <a class="navbar-brand" href="#">
                      <img src="https://i.imgur.com/uWemPNc.png" alt="" height="64">
                  </a>
                  </div>
              </center>
          </nav>
          <center>
              <div class="form-wrapper" style="max-width: 600px;padding-top: 5em;padding-bottom: 5em;">
              <center>
                      <h1>New Reply!</h1>
                      <p>Hi! You have a new reply to your ${type}, "${gist}..." with the following details</p>
                      <h4>"${replyGist}..."</h4>
                      <h4>By: ${replier}</h4>
                      <a href="${baseUrl}" class="btn btn-info" style="display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;border-radius: .25rem;color: #fff;background-color: #0d6efd;border-color: #0d6efd;">Login and View</a>
                      <br/><br/><br/>
                      <h6>If the button doesn't work, copy and open this link in your browser: ${baseUrl}</h6>
                  </center>
              </div>
              </center>
              <nav class="footer navbar-dark bg-dark" style="position: absolute;bottom: 0;width: 100%;padding: 0.6em;">
                  <div class="container" style="text-align: center;">
                  <p style="margin: 0!important;">&copy; Impedia 2021</p>
                  </div>
              </nav>
          </body>
          </html>`;

  var mailOptions = {
    from: `"Impedia" <${emailCredentials.user}>`,
    to: email,
    subject: "New Reply!",
    text: text,
    html: html,
  };
  /*
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Some error occured: " + error);
    } else {
      //console.log("Email sent: " + info.response);
    }
  });
  */
};

module.exports = {
  sendPasswordResetEmail,
  sendNewAuthorityEmail,
  sendNewAppealEmail,
  sendNewPetitionEmail,
  sendNewReplyEmail,
};
