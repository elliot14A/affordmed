import * as express from "express";
import { Request, Response } from "express";

const baseUrl = "http://localhost:8090/";

async function fetchWithTimeout(resource, options) {
    const { timeout } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  }

const app = express();

app.use(express.json());

app.get("/numbers", validateUrls, getNumbers);

app.listen(2801, () => console.log("server started"));

function validateUrls(req: Request, res: Response, next: express.NextFunction) {
  const validEndPoints = ["primes", "odd", "fibo", "rand"];

  let urlList = req.query["url"];
  if (typeof urlList == "string") {
    urlList = [urlList];
  }

  for (var j = 0; j < urlList.length; j++) {
    const url = urlList[j];
    console.log(url);
    if (!url.includes(baseUrl)) {
      return res.status(400).send("invalid query params");
    }
    const u = url.split(baseUrl);
    let exist = false;
    for (var i = 0; i < validEndPoints.length; i++) {
      if (validEndPoints[i] == u[1]) {
        exist = true;
      }
    }

    if (!exist) return res.status(400).send("invalid endpoints");

    return next();
  }
}
async function getNumbers(req: Request, res: Response) {
  const query = req.query;
  const urlList = req.query["url"];
  let urlList2: string[];
  if (typeof urlList == "string") {
    urlList2 = [urlList] as string[];
  }else {
      urlList2 = urlList as string[]
  }
  const finalArr = []
  for(var i = 0; i<urlList2.length;i++) {
      const numbers = await (await fetchWithTimeout(urlList2[i],{timeout: 500})).json() as {numbers: number[]}
      for (var j= 0; j<numbers.numbers.length; j++) {
          finalArr.push(numbers.numbers[j])
      }
  }
  console.log(finalArr)
  const nodupArr = []
  for(var i = 0; i<finalArr.length; i++) {
      if(nodupArr.indexOf(finalArr[i]) == -1) {
          nodupArr.push(finalArr[i])
      }
  }
  for(var i = 0; i<nodupArr.length; i++) {
      for(var j = 0; j < i; j++) {
          if(nodupArr[j] > nodupArr[j+1] ) {
              const temp = nodupArr[j]
              nodupArr[j] = nodupArr[j+1]
              nodupArr[j+1] = temp
          }
      }
  }
  return res.send(nodupArr);
}
