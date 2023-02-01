import fs from "fs"
import path from "path"
import { getSimpleId } from '../lib/utils'

export const useAppStore = () => {
    return useState('app-store', () => {

        let output_items = []

        const dataDir = `${path.join("public", "upload")}`

        if(fs.existsSync(dataDir)) {
            
            const files = fs.readdirSync(dataDir).filter(file => file.indexOf(".m4a.srt") >= 0)
            
            files.forEach(file => {

                const filename = `${path.join("public", "upload", file)}`
                
                let texts = []

                try {
                    
                    const data = fs.readFileSync(filename, 'utf8')
                    const tokens = data.split("\n")

                    let flag = false
                    let str = ""
                    
                    for(let i = 0; i < tokens.length; i++) {
                        
                        const txt = tokens[i].trim()
                        
                        if(txt.length === 0) continue

                        if(txt.indexOf("-->") >= 0) {
                            
                            let stoken = txt.split("-->")
                            let t1 = stoken[0].trim()
                            let t2 = stoken[1].trim()

                            if(t1.split(":").length > 2) {
                                stoken = t1.split(":")
                                t1 = [stoken[1], stoken[2]].join(":")
                            }
                            
                            if(t2.split(":").length > 2) {
                                stoken = t2.split(":")
                                t2 = [stoken[1], stoken[2]].join(":")
                            }

                            str = t1 + " --> " + t2
                            str = '[' + str.replace(/,/g, '.') + '] ';
                            flag = true

                        } else {

                            if(flag) {

                                str += txt 
                                texts.push(str)
                                flag = false

                            }

                        }

                    }

                } catch(err) {
                    console.log(err)
                }

                if(texts.length > 0) {

                    var stats = fs.statSync(filename)

                    output_items.push({
                        pid: getSimpleId(),
                        out: texts,
                        url: `/upload/${file.replace('.srt', '')}`,
                        datetime: stats.mtime,
                    })

                }

            })

        }

        return {
            items: output_items,
        }
    })
}
