import express from "express";
import path from "path"
export const route = express.Router();



// static resources, like pictures etc.
route.use("/resources", express.static("static/resources"));

// static client bundle
route.use(express.static("static/client"));

route.use("*", (req,res) => res.sendFile("static/client/index.html", { root: './'}) );

// export as {static_resources}
