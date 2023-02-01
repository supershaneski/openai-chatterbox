import formidable from "formidable"
import { exec } from 'child_process'
import fs from "fs"
import path from "path"
import { formatData, getSimpleId } from "../../lib/utils"

export default defineEventHandler(async (event) => {

    let dateTimeCreated = ''
    
    const form = formidable({ multiples: true })

    let data = await new Promise((resolve, reject) => {
        
        form.parse(event.req, (err, fields, files) => {

            if (err) {
                reject(err)
            }

            if (!files.file) {

                resolve({
                    status: "error",
                    message: "File not found",
                })

            }

            dateTimeCreated = fields.datetime
            
            if (files.file.mimetype.startsWith("application/octet-stream")) {
                
                let filename = Date.now() + Math.round(Math.random() * 100000) + files.file.originalFilename
                let newPath = `${path.join("public", "upload", filename)}`
                
                let oldPath = files.file.filepath
                
                // it is probably not necessary to copy the file to the upload folder
                // and just directly use the original file location
                fs.copyFileSync(oldPath, newPath)
                
                resolve({
                    status: "ok",
                    file: newPath,
                    url: `/upload/${filename}`
                })

            } else {

                resolve({
                    status: "error",
                    message: "File not audio data",
                })

            }

        })

    })

    if(data.status === "error") {
        return {
            status: "error"
        }
    }

    let fileUrl = data.url
    let filePath = data.file

    const outputDir = path.join("public", "upload") 
    //const filename = `${outputDir}/${data.file}`

    let sCommand = `whisper './${filePath}' --language English --model tiny --output_dir '${outputDir}'`
    
    data = await new Promise((resolve, reject) => {

        exec(sCommand, (error, stdout, stderr) => {
            
            if (error) {
                
                resolve({
                    status: 'error',
                    message: "Failed to transcribe [1]",
                })

            } else {

                resolve({
                    status: 'ok',
                    error: stderr,
                    pid: getSimpleId(),
                    out: formatData(stdout),
                    url: fileUrl,
                    datetime: dateTimeCreated,
                })

            }
            
        })

    })

    if(data.status === "error" || data.out.length === 0) {

        // delete file
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            status: "error"
        }
    }
    
    return data

})