const words = [
  "airor",
  "airer",
  "co",
  "cooler",
  "ajar",
  "boast",
  "shorten",
  "comparison",
  "six",
  "industrious",
  "texture",
  "yard",
  "discuss",
  "adjoining",
  "fax",
  "overconfident",
  "ground",
  "scarf",
  "crib",
  "attraction",
  "resemble",
  "cluttered",
];

import { Request, Response } from "express";
import * as express from "express";

const app = express();

app.use(express.json());

app.get("/prefixes", getPrefixes);

type Keyword = {
    word: string,
    status: boolean,
    prefix?: string
}

function getPrefixes(req: Request, res: Response) {
    const keywordsQ = req.query["keywords"] as string;
    const keywords: Keyword[] = []
    keywordsQ.split(",").forEach((word) => {
        if(words.indexOf(word) != -1) {
            keywords.push({
                word,
                status: true

            })
        } else {
            keywords.push({
                word,
                status: false,
                prefix:"not applicable"
            })
        }
    })
    keywords.forEach((keyword) => {
        words.forEach((word) => {
            if(word != keyword.word && keyword.status) {
                let prefix = ""
                const letters = keyword.word.split("");
                for(var i = 0; i<letters.length; i++) {
                    prefix += letters[i]
                    if(!word.startsWith(prefix)) {
                        break
                    }
                }

                if(!keyword.prefix) {
                    keyword.prefix = prefix
                }
                if(prefix.length > keyword.prefix?.length) {
                    console.log(prefix.slice(0, prefix.length-1))
                    keyword.prefix = prefix.slice(0, prefix.length-1)
                } else {
                    
                }
            }
        })
    })
    return res.send(keywords)
}

app.listen(3000, () => console.log("server started at 3000"))


